from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.modules.sales.schemas import SaleCreateIn, SaleOut
from app.modules.sales.service import create_sale, list_sales

router = APIRouter()


@router.post("/sales", response_model=SaleOut)
def create(data: SaleCreateIn, db: Session = Depends(get_db)):
    return create_sale(db, data)


@router.get("/sales", response_model=list[SaleOut])
def list_all(db: Session = Depends(get_db)):
    return list_sales(db)
