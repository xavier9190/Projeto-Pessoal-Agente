"""
Rota de chat — interface HTTP para o orquestrador do agente Xavier.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.agents.orchestrator import processar_mensagem

router = APIRouter()


class HistoryItem(BaseModel):
    role: str    # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[HistoryItem] = []


class ChatResponse(BaseModel):
    message: str


@router.post("", response_model=ChatResponse, summary="Envia mensagem ao agente Xavier")
def chat(body: ChatRequest) -> ChatResponse:
    """
    Recebe a mensagem atual e o historico completo da conversa (sem estado no servidor).
    Retorna a resposta textual do agente.
    """
    # Converte os HistoryItems para dicts simples que o LLM espera
    historico = [{"role": item.role, "content": item.content} for item in body.history]

    try:
        resposta = processar_mensagem(body.message, historico)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return ChatResponse(message=resposta)
