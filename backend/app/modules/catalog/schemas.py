from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    sku: str | None = None

class ProductOut(BaseModel):
    id: int
    name: str
    sku: str | None

    class Config:
        from_attributes = True
