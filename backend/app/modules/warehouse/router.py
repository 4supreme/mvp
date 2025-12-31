from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.modules.warehouse.schemas import WarehouseCreate, WarehouseOut, StockLineOut
from app.modules.warehouse.service import create_warehouse, list_warehouses, get_stock
from app.modules.warehouse.receipts import ReceiptCreateIn, post_receipt
router = APIRouter()


@router.post("/warehouses", response_model=WarehouseOut)
def create_wh(data: WarehouseCreate, db: Session = Depends(get_db)):
    return create_warehouse(db, data)


@router.get("/warehouses", response_model=list[WarehouseOut])
def list_wh(db: Session = Depends(get_db)):
    return list_warehouses(db)


@router.get("/stock", response_model=list[StockLineOut])
def stock(warehouse_id: int | None = None, db: Session = Depends(get_db)):
    return get_stock(db, warehouse_id=warehouse_id)


@router.post("/receipts")
def create_receipt(data: ReceiptCreateIn, db: Session = Depends(get_db)):
    return post_receipt(db, data)
