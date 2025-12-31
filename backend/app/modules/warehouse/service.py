from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.modules.warehouse.models import Warehouse, StockLedger
from app.modules.warehouse.schemas import WarehouseCreate


def create_warehouse(db: Session, data: WarehouseCreate) -> Warehouse:
    wh = Warehouse(name=data.name)
    db.add(wh)
    db.commit()
    db.refresh(wh)
    return wh


def list_warehouses(db: Session) -> list[Warehouse]:
    return db.execute(select(Warehouse).order_by(Warehouse.id)).scalars().all()


def get_stock(db: Session, warehouse_id: int | None = None):
    stmt = (
        select(
            StockLedger.product_id,
            StockLedger.warehouse_id,
            func.sum(StockLedger.qty_delta).label("qty"),
        )
        .group_by(StockLedger.product_id, StockLedger.warehouse_id)
    )
    if warehouse_id is not None:
        stmt = stmt.where(StockLedger.warehouse_id == warehouse_id)

    rows = db.execute(stmt).all()
    return [{"product_id": r[0], "warehouse_id": r[1], "qty": int(r[2] or 0)} for r in rows]
