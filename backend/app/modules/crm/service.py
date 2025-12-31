from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.crm.models import Customer
from app.modules.crm.schemas import CustomerCreate


def create_customer(db: Session, data: CustomerCreate) -> Customer:
    c = Customer(name=data.name, phone=data.phone)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


def list_customers(db: Session) -> list[Customer]:
    return db.execute(select(Customer).order_by(Customer.id)).scalars().all()
