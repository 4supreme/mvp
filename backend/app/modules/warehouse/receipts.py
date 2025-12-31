from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.modules.warehouse.models import StockLedger


class ReceiptLineIn(BaseModel):
    product_id: int
    qty: int = Field(gt=0)


class ReceiptCreateIn(BaseModel):
    warehouse_id: int
    lines: list[ReceiptLineIn]


def post_receipt(db: Session, data: ReceiptCreateIn) -> dict:
    # В MVP doc_id сделаем псевдо-id: возьмём следующий по ledger
    last_id = db.query(StockLedger.id).order_by(StockLedger.id.desc()).first()
    doc_id = (last_id[0] if last_id else 0) + 1

    for line in data.lines:
        db.add(
            StockLedger(
                product_id=line.product_id,
                warehouse_id=data.warehouse_id,
                qty_delta=line.qty,
                doc_type="receipt",
                doc_id=doc_id,
            )
        )

    db.commit()
    return {"doc_id": doc_id, "status": "posted"}
