"""
Definição das tools no formato OpenAI JSON Schema para o agente Xavier.
As enums de categoria são derivadas diretamente de categorias.py.
"""
from app.agents.tools.categorias import CATEGORIAS

# Enum gerado dinamicamente a partir das chaves de CATEGORIAS
_CATEGORIA_ENUM = list(CATEGORIAS.keys())

TOOLS: list[dict] = [
    {
        "type": "function",
        "function": {
            "name": "listar_eventos",
            "description": (
                "Lista eventos do Google Calendar do usuario entre duas datas. "
                "Use quando o usuario pedir para ver, consultar ou listar eventos, "
                "compromissos ou agenda."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "data_inicio": {
                        "type": "string",
                        "description": (
                            "Data de inicio da consulta no formato ISO 8601 "
                            "(YYYY-MM-DD). Exemplo: '2025-08-01'."
                        ),
                    },
                    "data_fim": {
                        "type": "string",
                        "description": (
                            "Data de fim da consulta no formato ISO 8601 "
                            "(YYYY-MM-DD). Exemplo: '2025-08-31'."
                        ),
                    },
                },
                "required": ["data_inicio", "data_fim"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "criar_evento",
            "description": (
                "Cria um novo evento no Google Calendar do usuario. "
                "Use quando o usuario pedir para marcar, agendar, criar ou "
                "adicionar um compromisso, reuniao ou evento. "
                "Sempre escolha a categoria mais adequada ao conteudo do pedido."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "titulo": {
                        "type": "string",
                        "description": "Titulo do evento. Seja descritivo e conciso.",
                    },
                    "data_inicio": {
                        "type": "string",
                        "description": (
                            "Data e hora de inicio no formato ISO 8601 "
                            "(YYYY-MM-DDTHH:MM:SS). Exemplo: '2025-08-10T14:00:00'."
                        ),
                    },
                    "data_hora_fim": {
                        "type": "string",
                        "description": (
                            "Data e hora de fim no formato ISO 8601 "
                            "(YYYY-MM-DDTHH:MM:SS). Exemplo: '2025-08-10T15:00:00'. "
                            "Se o usuario nao informar, assuma 1 hora apos o inicio."
                        ),
                    },
                    "categoria": {
                        "type": "string",
                        "enum": _CATEGORIA_ENUM,
                        "description": (
                            "Categoria do evento. OBRIGATORIO. Escolha com base no "
                            "conteudo: trabalho (reunioes, tarefas profissionais), "
                            "pessoal (familia, amigos, obrigacoes pessoais), "
                            "saude (consultas, academia, bem-estar), "
                            "estudos (cursos, leituras, revisoes), "
                            "lazer (entretenimento, viagens, hobbies)."
                        ),
                    },
                },
                "required": ["titulo", "data_inicio", "data_hora_fim", "categoria"],
            },
        },
    },
]
