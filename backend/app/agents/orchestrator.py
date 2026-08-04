"""
Orquestrador do agente Xavier.

Recebe a mensagem do usuario + historico, chama o LLM com tool calling,
executa as tools necessarias e retorna a resposta final em texto.
"""
import json
import logging

from app.agents.llm_client import LLMClient
from app.agents.prompts import SYSTEM_PROMPT
from app.agents.tools.definitions import TOOLS
from app.agents.tools.categorias import CATEGORIAS
from app.integrations.google.calendar_service import GoogleCalendarService

logger = logging.getLogger(__name__)

# Instancias compartilhadas (sem estado mutavel entre requests)
_llm = LLMClient()
_calendar = GoogleCalendarService()


def _executar_tool(name: str, arguments: dict) -> str:
    """
    Executa a tool indicada e retorna o resultado serializado como string JSON,
    pronto para ser enviado como mensagem role='tool' ao LLM.
    """
    if name == "listar_eventos":
        resultado = _calendar.listar_eventos(
            data_inicio=arguments["data_inicio"],
            data_fim=arguments["data_fim"],
        )
        return json.dumps(resultado, ensure_ascii=False)

    if name == "criar_evento":
        categoria_key = arguments["categoria"]
        color_id = CATEGORIAS[categoria_key]["color_id"]

        resultado = _calendar.criar_evento(
            titulo=arguments["titulo"],
            inicio=arguments["data_inicio"],
            fim=arguments["data_hora_fim"],
            color_id=color_id,
        )
        # Inclui o nome legivel da categoria na resposta para o LLM mencionar
        resultado["categoria_nome"] = CATEGORIAS[categoria_key]["nome"]
        return json.dumps(resultado, ensure_ascii=False)

    raise ValueError(f"Tool desconhecida: {name}")


def processar_mensagem(mensagem_usuario: str, historico: list[dict]) -> str:
    """
    Ponto de entrada do orquestrador.

    Args:
        mensagem_usuario: Texto novo enviado pelo usuario.
        historico: Lista de mensagens anteriores no formato OpenAI
                   [{"role": "user"|"assistant", "content": str}, ...].
                   Vem do frontend a cada requisicao — sem estado persistido aqui.

    Returns:
        Texto final gerado pelo LLM para exibir ao usuario.
    """
    # 1. Monta a lista completa de messages
    messages: list[dict] = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *historico,
        {"role": "user", "content": mensagem_usuario},
    ]

    # 2. Primeira chamada ao LLM (pode devolver tool_calls)
    resposta = _llm.chat(messages, tools=TOOLS)
    choice = resposta["choices"][0]
    assistant_message = choice["message"]

    # Adiciona a mensagem do assistant ao historico local desta requisicao
    messages.append(assistant_message)

    # 3. Loop de tool calling (suporta multiplas tools na mesma resposta)
    max_iteracoes = 5
    for _ in range(max_iteracoes):
        tool_calls = assistant_message.get("tool_calls")
        if not tool_calls:
            break  # Sem tool_calls: resposta final em texto

        logger.info("[Orchestrator] Tool calls recebidas: %d", len(tool_calls))

        # Executa cada tool e adiciona resultado como role="tool"
        for tc in tool_calls:
            tool_id = tc["id"]
            tool_name = tc["function"]["name"]
            tool_args = json.loads(tc["function"]["arguments"])

            logger.info("[Orchestrator] Executando tool: %s args=%s", tool_name, tool_args)
            print(f"[Orchestrator] Executando tool: {tool_name} | args: {tool_args}")

            try:
                tool_result = _executar_tool(tool_name, tool_args)
            except Exception as exc:
                tool_result = json.dumps({"erro": str(exc)}, ensure_ascii=False)
                logger.error("[Orchestrator] Erro na tool %s: %s", tool_name, exc)

            messages.append({
                "role": "tool",
                "tool_call_id": tool_id,
                "content": tool_result,
            })

        # Nova chamada ao LLM com os resultados das tools
        resposta = _llm.chat(messages, tools=TOOLS)
        choice = resposta["choices"][0]
        assistant_message = choice["message"]
        messages.append(assistant_message)

    # 4. Extrai e retorna o texto final
    texto_final = assistant_message.get("content") or ""
    if not texto_final:
        texto_final = "Desculpe, nao consegui gerar uma resposta. Tente novamente."

    return texto_final
