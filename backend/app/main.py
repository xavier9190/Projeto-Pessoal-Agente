"""
Xavier Agent — FastAPI application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------------------------------------------------------
# App instance
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Xavier Agent API",
    description="Hub pessoal de produtividade — backend mínimo funcional.",
    version="0.1.0",
)

# ---------------------------------------------------------------------------
# CORS — libera somente a origem do Vite em dev
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
from app.api.routes.calendar import router as calendar_router
app.include_router(calendar_router, prefix="/api/calendar", tags=["calendar"])

# TODO (Fase 4): descomentar quando backend/app/api/routes/chat.py existir
from app.api.routes.chat import router as chat_router
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])

# ---------------------------------------------------------------------------
# Health-check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["meta"])
async def health() -> dict:
    """Verifica se o servidor está no ar."""
    return {"status": "ok"}
