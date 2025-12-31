from pydantic import BaseModel


class CustomerCreate(BaseModel):
    name: str
    phone: str | None = None


class CustomerOut(BaseModel):
    id: int
    name: str
    phone: str | None = None

    class Config:
        from_attributes = True
