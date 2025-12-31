from __future__ import annotations

from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class Warehouse(Base):
    __tablename__ = "warehouses"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class StockLedger(Base):
    __tablename__ = "stock_ledger"

    id: Mapped[int] = mapped_column(primary_key=True)

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), index=True)
    warehouse_id: Mapped[int] = mapped_column(ForeignKey("warehouses.id"), index=True)

    qty_delta: Mapped[int] = mapped_column(Integer)  # + приход, - расход

    doc_type: Mapped[str] = mapped_column(String(30))  # "receipt" / "sale" / "adjustment"
    doc_id: Mapped[int] = mapped_column(Integer)       # id документа (пока простой int)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    warehouse: Mapped["Warehouse"] = relationship()
