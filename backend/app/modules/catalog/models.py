from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base

class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    sku: Mapped[str | None] = mapped_column(String(100), unique=True)
