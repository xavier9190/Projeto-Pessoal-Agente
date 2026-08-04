# Como Rodar o Projeto (Xavier Agent)

Para rodar o projeto completo em ambiente de desenvolvimento, você precisará abrir **dois terminais** na raiz do projeto.

## 1. Backend (FastAPI)

No primeiro terminal, acesse a pasta `backend` e inicie o servidor:

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
> **Dica:** Você também pode simplesmente dar um duplo-clique no arquivo `backend\run.bat` pelo Explorador de Arquivos do Windows.

- **API:** http://localhost:8000
- **Documentação (Swagger):** http://localhost:8000/docs

---

## 2. Frontend (React + Vite)

No segundo terminal, acesse a pasta `frontend` e inicie o ambiente Vite:

```bash
cd frontend
npm run dev
```

- **Aplicação Web:** http://localhost:5173

---

## 3. Como Testar a API (Google Calendar)

Com o backend rodando, você pode testar a integração com o Google Calendar usando o terminal (PowerShell) ou acessando o Swagger UI em http://localhost:8000/docs (mais fácil para testar o POST).

**Listar eventos (PowerShell):**
```powershell
curl "http://localhost:8000/api/calendar/events?inicio=2025-08-01&fim=2025-08-31"
```

**Criar evento (PowerShell):**
```powershell
curl -X POST "http://localhost:8000/api/calendar/events" `
     -H "Content-Type: application/json" `
     -d '{"titulo": "Reunião de teste", "inicio": "2025-08-10T10:00:00", "fim": "2025-08-10T11:00:00", "color_id": "9"}'
```

**`color_id` de referência rápida:**
- Trabalho: `"9"`
- Pessoal: `"10"`
- Saúde: `"11"`
- Estudos: `"3"`
- Lazer: `"6"`
