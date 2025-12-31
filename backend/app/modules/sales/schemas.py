from pydantic import BaseModel, Field


class SaleLineIn(BaseModel):
    product_id: int
    qty: int = Field(gt=0)
    price: int = Field(ge=0)


class SaleCreateIn(BaseModel):
    warehouse_id: int
    customer_id: int
    lines: list[SaleLineIn]


class SaleLineOut(BaseModel):
    id: int
    product_id: int
    qty: int
    price: int

    class Config:
        from_attributes = True


class SaleOut(BaseModel):
    id: int
    warehouse_id: int
    customer_id: int
    lines: list[SaleLineOut]

    class Config:
        from_attributes = True
