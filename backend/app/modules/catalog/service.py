from sqlalchemy.orm import Session

from app.modules.catalog.models import Product
from app.modules.catalog.schemas import ProductCreate

def create_product(db: Session, data: ProductCreate) -> Product:
    product = Product(**data.dict())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

def list_products(db: Session) -> list[Product]:
    return db.query(Product).all()
