from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.modules.crm.schemas import CustomerCreate, CustomerOut
from app.modules.crm.service import create_customer, list_customers

router = APIRouter()


@router.post("/customers", response_model=CustomerOut)
def create(data: CustomerCreate, db: Session = Depends(get_db)):
    return create_customer(db, data)


@router.get("/customers", response_model=list[CustomerOut])
def list_all(db: Session = Depends(get_db)):
    return list_customers(db)
