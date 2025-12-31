from fastapi import FastAPI

from app.core.db import create_tables

# чтобы SQLAlchemy увидел модели
from app.modules.catalog import models as catalog_models  # noqa
from app.modules.warehouse import models as warehouse_models  # noqa

from app.modules.catalog.router import router as catalog_router
from app.modules.warehouse.router import router as warehouse_router
from app.modules.sales.router import router as sales_router
from app.modules.crm.router import router as crm_router
from app.modules.crm import models as crm_models  # noqa: F401
from app.modules.sales import models as sales_models  # noqa: F401


app = FastAPI(title="MVP ERP")

@app.on_event("startup")
def on_startup():
    create_tables()

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(catalog_router, prefix="/catalog", tags=["catalog"])
app.include_router(warehouse_router, prefix="/warehouse", tags=["warehouse"])
app.include_router(sales_router, prefix="/sales", tags=["sales"])
app.include_router(crm_router, prefix="/crm", tags=["crm"])
