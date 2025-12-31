from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.modules.catalog.schemas import ProductCreate, ProductOut
from app.modules.catalog.service import create_product, list_products

router = APIRouter()

@router.post("/products", response_model=ProductOut)
def create(data: ProductCreate, db: Session = Depends(get_db)):
    return create_product(db, data)

@router.get("/products", response_model=list[ProductOut])
def list_all(db: Session = Depends(get_db)):
    return list_products(db)
