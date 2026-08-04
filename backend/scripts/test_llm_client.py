"""
Script de teste manual do LLMClient com fallback.
Execute a partir da pasta backend:

    python scripts/test_llm_client.py

Saida esperada:
    [LLMClient] [OK] Provedor: HuggingFace (primario)
    Resposta: Ola! ...
"""
import sys
import os

# Garante que 'backend/' esta no path para importar 'app.*'
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Carrega o .env antes de qualquer import de 'app'
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[2] / ".env")

from app.agents.llm_client import LLMClient  # noqa: E402

def main() -> None:
    client = LLMClient()

    messages = [
        {"role": "user", "content": "Diga apenas 'Ola! Estou funcionando.' e nada mais."}
    ]

    print("Enviando mensagem de teste ao LLM...\n")
    try:
        response = client.chat(messages)
        content = response["choices"][0]["message"]["content"]
        print(f"\nResposta do modelo:\n  {content}\n")
    except Exception as exc:
        print(f"\n[ERRO] Ambos os provedores falharam: {exc}")
        print("Verifique as chaves HUGGINGFACE_API_KEY e GROQ_API_KEY no .env")
        sys.exit(1)


if __name__ == "__main__":
    main()
