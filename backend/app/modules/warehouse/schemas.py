from pydantic import BaseModel


class WarehouseCreate(BaseModel):
    name: str


class WarehouseOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class StockLineOut(BaseModel):
    product_id: int
    warehouse_id: int
    qty: int
