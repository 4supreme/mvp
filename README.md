# MVP ERP (FastAPI)

## Run (Windows PowerShell)

Activate venv (you already did):
- .\venv\Scripts\Activate.ps1

Install deps:
- cd backend
- pip install -r requirements.txt

Run server:
- uvicorn app.main:app --reload

Health:
- http://127.0.0.1:8000/health
Docs:
- http://127.0.0.1:8000/docs

## Run frontend

```bash
cd frontend
npm install
npm run dev
