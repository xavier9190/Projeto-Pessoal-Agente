"""
Client LLM genérico com fallback automático entre HuggingFace e Groq.
Ambos expõem a API no formato OpenAI-compatible.
"""
import logging
import requests

from app.core.config import settings

logger = logging.getLogger(__name__)

_MODEL = "openai/gpt-oss-120b"
_TIMEOUT = 30  # segundos


class OpenAICompatibleClient:
    """Client para qualquer endpoint compatível com a API OpenAI chat/completions."""

    def __init__(self, base_url: str, api_key: str, model: str) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.model = model

    def chat(self, messages: list, tools: list | None = None) -> dict:
        """
        Faz POST em {base_url}/chat/completions.
        Lança exceção se status != 200 ou se o JSON não puder ser lido.
        """
        url = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload: dict = {
            "model": self.model,
            "messages": messages,
        }
        if tools:
            payload["tools"] = tools
            payload["tool_choice"] = "auto"

        response = requests.post(url, headers=headers, json=payload, timeout=_TIMEOUT)

        if response.status_code != 200:
            raise RuntimeError(
                f"HTTP {response.status_code} de {self.base_url}: {response.text[:300]}"
            )

        return response.json()


class LLMClient:
    """
    Client LLM com fallback automático.

    Tenta o provedor primário (HuggingFace); qualquer exceção ativa
    automaticamente o fallback (Groq), sem distinguir o tipo de erro.
    """

    def __init__(self) -> None:
        self._primary = OpenAICompatibleClient(
            base_url="https://router.huggingface.co/v1",
            api_key=settings.HUGGINGFACE_API_KEY,
            model=_MODEL,
        )
        self._fallback = OpenAICompatibleClient(
            base_url="https://api.groq.com/openai/v1",
            api_key=settings.GROQ_API_KEY,
            model=_MODEL,
        )

    def chat(self, messages: list, tools: list | None = None) -> dict:
        """
        Envia mensagens ao LLM com fallback automático.
        Loga no console qual provedor respondeu.
        """
        try:
            result = self._primary.chat(messages, tools)
            logger.info("[LLMClient] Provedor respondeu: HuggingFace (primario)")
            print("[LLMClient] [OK] Provedor: HuggingFace (primario)")
            return result
        except Exception as primary_exc:
            logger.warning(
                "[LLMClient] Primário falhou (%s). Ativando fallback: Groq...",
                primary_exc,
            )
            print(f"[LLMClient] [WARN] Primario (HuggingFace) falhou: {primary_exc}")
            print("[LLMClient] [FALLBACK] Tentando fallback: Groq...")

            result = self._fallback.chat(messages, tools)
            logger.info("[LLMClient] Provedor respondeu: Groq (fallback)")
            print("[LLMClient] [OK] Provedor: Groq (fallback)")
            return result
