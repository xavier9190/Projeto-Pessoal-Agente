import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("HUGGINGFACE_API_KEY")
url = "https://router.huggingface.co/v1/chat/completions"
headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

MODELS = [
    "openai/gpt-oss-20b",                              
    "Qwen/Qwen3-32B",                                   
    "meta-llama/Llama-4-Scout-17B-16E-Instruct",        
    "zai-org/GLM-4.5-Air",                              
    "openai/gpt-oss-120b",                              
]

tools = [{
    "type": "function",
    "function": {
        "name": "check_calendar",
        "description": "Verifica eventos no calendário do executivo em uma data específica",
        "parameters": {
            "type": "object",
            "properties": {
                "date": {"type": "string", "description": "Data no formato YYYY-MM-DD"}
            },
            "required": ["date"]
        }
    }
}]

# Pergunta que SÓ faz sentido respondida via tool call
messages = [{"role": "user", "content": "Tenho alguma reunião marcada amanhã, dia 20 de julho de 2026?"}]

def test_model(model, messages, tools):
    payload = {
        "model": model,
        "messages": messages,
        "tools": tools,
        "tool_choice": "auto",
        "max_tokens": 200
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=20)
        if response.status_code != 200:
            return "FALHOU", f"{response.status_code} - {response.text[:150]}"

        message = response.json()["choices"][0]["message"]
        tool_calls = message.get("tool_calls")

        if not tool_calls:
            return "SEM TOOL CALL", f"Respondeu em texto: {message.get('content', '')[:100]}"

        call = tool_calls[0]["function"]
        try:
            args = json.loads(call["arguments"])
        except json.JSONDecodeError:
            return "JSON INVÁLIDO", call["arguments"]

        if call["name"] != "check_calendar" or "date" not in args:
            return "SCHEMA ERRADO", f"name={call['name']} args={args}"

        return "OK", f"name={call['name']} args={args}"

    except Exception as e:
        return "ERRO", str(e)

if __name__ == "__main__":
    for model in MODELS:    
        status, detail = test_model(model=model, messages=messages, tools=tools)
        print(f"[{status:15}] {model}")
        print(f"                → {detail}\n")