"""
Rotas temporárias para testar a integração com o Google Calendar manualmente.
Remover ou mover para o agente quando o fluxo de chat estiver pronto.
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.integrations.google.calendar_service import GoogleCalendarService

router = APIRouter()


def _get_service() -> GoogleCalendarService:
    try:
        return GoogleCalendarService()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Falha ao autenticar com Google: {exc}")


# ------------------------------------------------------------------
# GET /api/calendar/events?inicio=YYYY-MM-DD&fim=YYYY-MM-DD
# ------------------------------------------------------------------
@router.get("/events", summary="Lista eventos do Google Calendar")
def listar_eventos(
    inicio: str = Query(..., examples=["2025-08-01"], description="Data de início (YYYY-MM-DD ou ISO 8601)"),
    fim: str = Query(..., examples=["2025-08-31"], description="Data de fim (YYYY-MM-DD ou ISO 8601)"),
):
    """Retorna os eventos do calendário configurado no .env entre as datas fornecidas."""
    service = _get_service()
    try:
        eventos = service.listar_eventos(inicio, fim)
        return {"total": len(eventos), "eventos": eventos}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ------------------------------------------------------------------
# POST /api/calendar/events  (criação — útil para testes manuais)
# ------------------------------------------------------------------
class CriarEventoBody(BaseModel):
    titulo: str
    inicio: str  # ISO 8601, ex: '2025-08-10T10:00:00'
    fim: str     # ISO 8601, ex: '2025-08-10T11:00:00'
    color_id: str = "9"  # default: Blueberry (Trabalho)


@router.post("/events", summary="Cria um evento no Google Calendar", status_code=201)
def criar_evento(body: CriarEventoBody):
    """Cria um evento e retorna os dados do evento criado."""
    service = _get_service()
    try:
        evento = service.criar_evento(body.titulo, body.inicio, body.fim, body.color_id)
        return evento
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ------------------------------------------------------------------
# PATCH /api/calendar/events/{event_id}  (edição restrita: data/hora/cor)
# ------------------------------------------------------------------
class AtualizarEventoBody(BaseModel):
    inicio: str | None = None   # ISO 8601, ex: '2025-08-10T10:00:00'
    fim: str | None = None      # ISO 8601, ex: '2025-08-10T11:00:00'
    color_id: str | None = None # colorId do Google Calendar


@router.patch("/events/{event_id}", summary="Atualiza data/hora/cor de um evento")
def atualizar_evento(event_id: str, body: AtualizarEventoBody):
    """Atualiza parcialmente um evento (apenas inicio, fim e/ou color_id)."""
    if not any([body.inicio, body.fim, body.color_id]):
        raise HTTPException(status_code=422, detail="Nenhum campo para atualizar fornecido.")
    service = _get_service()
    try:
        evento = service.atualizar_evento(event_id, body.inicio, body.fim, body.color_id)
        return evento
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ------------------------------------------------------------------
# DELETE /api/calendar/events/{event_id}
# ------------------------------------------------------------------
@router.delete("/events/{event_id}", summary="Exclui um evento do Google Calendar", status_code=204)
def excluir_evento(event_id: str):
    """Exclui permanentemente um evento do calendário."""
    service = _get_service()
    try:
        service.excluir_evento(event_id)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
