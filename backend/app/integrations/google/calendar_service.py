"""
Serviço de integração com o Google Calendar via service account.
Reaproveiта a lógica validada em testapi.py.
"""
from pathlib import Path
from typing import Optional

from google.oauth2 import service_account
from googleapiclient.discovery import build

from app.core.config import settings

# Escopos necessários para leitura e escrita no Calendar
_SCOPES = ["https://www.googleapis.com/auth/calendar"]


def _resolve_credentials_path() -> str:
    """
    GOOGLE_APPLICATION_CREDENTIALS pode ser um caminho relativo
    (ex: 'google_credentials.json' apontando para a raiz do projeto).
    Resolve para caminho absoluto a partir da raiz.
    """
    cred_path = settings.GOOGLE_APPLICATION_CREDENTIALS
    p = Path(cred_path)
    if p.is_absolute():
        return str(p)
    # raiz do projeto = 4 níveis acima de backend/app/integrations/google/
    root = Path(__file__).resolve().parents[4]
    return str(root / cred_path)


class GoogleCalendarService:
    """Client do Google Calendar autenticado via service account."""

    def __init__(self) -> None:
        creds_file = _resolve_credentials_path()
        creds = service_account.Credentials.from_service_account_file(
            creds_file, scopes=_SCOPES
        )
        self._service = build("calendar", "v3", credentials=creds)
        self._calendar_id: str = settings.CALENDAR_EMAIL

    # ------------------------------------------------------------------
    # Listagem de eventos
    # ------------------------------------------------------------------
    def listar_eventos(self, data_inicio: str, data_fim: str) -> list[dict]:
        """
        Lista eventos entre data_inicio e data_fim (formato ISO 8601,
        ex: '2025-08-01' ou '2025-08-01T00:00:00Z').

        Retorna lista de dicts com: id, titulo, inicio, fim, colorId.
        """
        # Garante sufixo 'T00:00:00Z' para datas simples YYYY-MM-DD
        time_min = _ensure_rfc3339(data_inicio, is_start=True)
        time_max = _ensure_rfc3339(data_fim, is_start=False)

        result = (
            self._service.events()
            .list(
                calendarId=self._calendar_id,
                timeMin=time_min,
                timeMax=time_max,
                singleEvents=True,
                orderBy="startTime",
            )
            .execute()
        )

        eventos = []
        for item in result.get("items", []):
            eventos.append(_parse_event(item))
        return eventos

    # ------------------------------------------------------------------
    # Criação de evento
    # ------------------------------------------------------------------
    def criar_evento(
        self,
        titulo: str,
        inicio: str,
        fim: str,
        color_id: str,
    ) -> dict:
        """
        Cria um evento no calendário com colorId nativo do Google Calendar.

        color_id: string numérica (ex: '9' = Blueberry, '10' = Sage…)
        Retorna dict com: id, titulo, inicio, fim, colorId.
        """
        body = {
            "summary": titulo,
            "colorId": color_id,
            "start": _datetime_obj(inicio),
            "end": _datetime_obj(fim),
        }
        created = (
            self._service.events()
            .insert(calendarId=self._calendar_id, body=body)
            .execute()
        )
        return _parse_event(created)


# ------------------------------------------------------------------
# Helpers privados
# ------------------------------------------------------------------

def _parse_event(item: dict) -> dict:
    """Normaliza um item bruto da API para o formato interno."""
    start = item.get("start", {})
    end = item.get("end", {})
    return {
        "id": item.get("id", ""),
        "titulo": item.get("summary", "(sem título)"),
        "inicio": start.get("dateTime", start.get("date", "")),
        "fim": end.get("dateTime", end.get("date", "")),
        "colorId": item.get("colorId"),  # None se não definido
    }


def _ensure_rfc3339(date_str: str, *, is_start: bool) -> str:
    """
    Se a string for só uma data (YYYY-MM-DD), converte para RFC 3339
    com hora 00:00:00Z (início do dia) ou 23:59:59Z (fim do dia).
    """
    if "T" not in date_str and "Z" not in date_str and len(date_str) == 10:
        suffix = "T00:00:00Z" if is_start else "T23:59:59Z"
        return date_str + suffix
    return date_str


def _datetime_obj(dt_str: str) -> dict:
    """
    Retorna o objeto de data/hora esperado pela API do Google Calendar.
    Se for só YYYY-MM-DD, usa campo 'date'; senão usa 'dateTime'.
    """
    if len(dt_str) == 10:  # ex: '2025-08-05'
        return {"date": dt_str}
    return {"dateTime": dt_str, "timeZone": "America/Sao_Paulo"}
