from sqlalchemy import select, func
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.modules.sales.models import Sale, SaleLine
from app.modules.sales.schemas import SaleCreateIn
from app.modules.warehouse.models import StockLedger


def _get_available_qty(db: Session, warehouse_id: int, product_id: int) -> int:
    qty = db.execute(
        select(func.coalesce(func.sum(StockLedger.qty_delta), 0))
        .where(StockLedger.warehouse_id == warehouse_id)
        .where(StockLedger.product_id == product_id)
    ).scalar_one()
    return int(qty)


def create_sale(db: Session, data: SaleCreateIn) -> Sale:
    # 1) Проверяем остатки заранее (запрет минуса)
    for line in data.lines:
        available = _get_available_qty(db, data.warehouse_id, line.product_id)
        if available < line.qty:
            raise HTTPException(
                status_code=400,
                detail=f"Недостаточно товара product_id={line.product_id} на складе warehouse_id={data.warehouse_id}. "
                       f"Доступно: {available}, нужно: {line.qty}"
            )

    # 2) Создаём документ продажи
    sale = Sale(warehouse_id=data.warehouse_id, customer_id=data.customer_id)
    db.add(sale)
    db.commit()
    db.refresh(sale)

    # 3) Строки + движения (-qty)
    for line in data.lines:
        db.add(SaleLine(sale_id=sale.id, product_id=line.product_id, qty=line.qty, price=line.price))

        db.add(
            StockLedger(
                product_id=line.product_id,
                warehouse_id=data.warehouse_id,
                qty_delta=-line.qty,
                doc_type="sale",
                doc_id=sale.id,
            )
        )

    db.commit()
    db.refresh(sale)
    return sale


def list_sales(db: Session) -> list[Sale]:
    return db.execute(select(Sale).order_by(Sale.id.desc())).scalars().all()
