# 🔗 Exemplos de Respostas da API

## 📞 Endpoints Disponíveis

### 1️⃣ Verificar CPF

**Requisição:**
```javascript
fetch('https://seu-worker.workers.dev/api/verificar-cpf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cpf: '12345678901' })
})
```

**Resposta - CPF Já Existe (usuário recorrente):**
```json
{
  "existe": true,
  "dados": {
    "cpf": "12345678901",
    "nome": "João Silva",
    "cnh": "1234567890",
    "placa": "ABC-1234",
    "prova_respondida": {
      "data": "2024-01-15T10:30:00.000Z",
      "respostas": {
        "q1": "Madeira",
        "q2": "Todos os dias",
        "q3": "Com o motorista"
      },
      "resultado": "aprovado"
    },
    "data_criacao": "2024-01-15T10:20:00.000Z",
    "primeiroAcesso": true
  }
}
```

**Resposta - CPF Novo (primeira vez):**
```json
{
  "existe": false,
  "mensagem": "Novo motorista - realize a prova"
}
```

---

### 2️⃣ Salvar Motorista (após prova)

**Requisição:**
```javascript
fetch('https://seu-worker.workers.dev/api/salvar-motorista', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cpf: '12345678901',
    nome: 'João Silva',
    cnh: '1234567890',
    placa: 'ABC-1234',
    prova_respondida: {
      data: '2024-01-15T10:30:00.000Z',
      respostas: {
        q1: 'Madeira',
        q2: 'Todos os dias',
        q3: 'Com o motorista'
      },
      resultado: 'aprovado'
    }
  })
})
```

**Resposta - Sucesso:**
```json
{
  "sucesso": true,
  "mensagem": "Motorista registrado com sucesso"
}
```

**Resposta - Erro:**
```json
{
  "erro": "CPF inválido"
}
```

---

### 3️⃣ Salvar Inspeção Veicular

**Requisição:**
```javascript
fetch('https://seu-worker.workers.dev/api/salvar-inspecao', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cpf: '12345678901',
    inspecao_dados: {
      nome: 'João Silva',
      cnh: '1234567890',
      placa: 'ABC-1234',
      pedido: 'PED-001',
      eixos: '2',
      pneus: 'CONFORME',
      carroceria: 'CONFORME',
      cinto: 'CONFORME',
      farois: 'CONFORME',
      alarme_re: 'CONFORME',
      vazamentos: 'SEM_VAZAMENTO',
      calcos: 'CONFORME'
    }
  })
})
```

**Resposta - Sucesso:**
```json
{
  "sucesso": true,
  "id_inspecao": "inspecao_12345678901_1705328400000",
  "mensagem": "Inspeção salva com sucesso"
}
```

---

### 4️⃣ Obter Histórico de Inspeções

**Requisição:**
```javascript
fetch('https://seu-worker.workers.dev/api/historico-inspecoes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cpf: '12345678901' })
})
```

**Resposta - Com dados:**
```json
{
  "inspecoes": [
    {
      "cpf": "12345678901",
      "nome": "João Silva",
      "cnh": "1234567890",
      "placa": "ABC-1234",
      "pedido": "PED-001",
      "eixos": "2",
      "pneus": "CONFORME",
      "carroceria": "CONFORME",
      "cinto": "CONFORME",
      "farois": "CONFORME",
      "alarme_re": "CONFORME",
      "vazamentos": "SEM_VAZAMENTO",
      "calcos": "CONFORME",
      "data_inspecao": "2024-01-15T11:00:00.000Z"
    },
    {
      "cpf": "12345678901",
      "nome": "João Silva",
      "cnh": "1234567890",
      "placa": "ABC-1234",
      "pedido": "PED-002",
      "eixos": "2",
      "pneus": "NAO_CONFORME",
      "carroceria": "CONFORME",
      "cinto": "CONFORME",
      "farois": "CONFORME",
      "alarme_re": "CONFORME",
      "vazamentos": "SEM_VAZAMENTO",
      "calcos": "CONFORME",
      "data_inspecao": "2024-01-14T09:30:00.000Z"
    }
  ]
}
```

---

## 🧪 Testando com cURL (Terminal)

### Verificar CPF:
```bash
curl -X POST https://seu-worker.workers.dev/api/verificar-cpf \
  -H "Content-Type: application/json" \
  -d '{"cpf":"12345678901"}'
```

### Salvar Motorista:
```bash
curl -X POST https://seu-worker.workers.dev/api/salvar-motorista \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901",
    "nome": "João Silva",
    "cnh": "1234567890",
    "placa": "ABC-1234",
    "prova_respondida": {"resultado": "aprovado"}
  }'
```

---

## 📊 Estrutura de Dados no KV

### MOTORISTAS Namespace
```
Chave: "12345678901"
Valor:
{
  "cpf": "12345678901",
  "nome": "João Silva",
  "cnh": "1234567890",
  "placa": "ABC-1234",
  "prova_respondida": { ... },
  "data_criacao": "2024-01-15T10:20:00.000Z",
  "primeiroAcesso": true
}
```

### INSPECOES Namespace
```
Chave: "inspecao_12345678901_1705328400000"
Valor:
{
  "cpf": "12345678901",
  "nome": "João Silva",
  "cnh": "1234567890",
  "placa": "ABC-1234",
  "pedido": "PED-001",
  "eixos": "2",
  "pneus": "CONFORME",
  "carroceria": "CONFORME",
  "cinto": "CONFORME",
  "farois": "CONFORME",
  "alarme_re": "CONFORME",
  "vazamentos": "SEM_VAZAMENTO",
  "calcos": "CONFORME",
  "data_inspecao": "2024-01-15T11:00:00.000Z"
}
```

---

## 🔐 Códigos de Erro HTTP

| Código | Significado | Solução |
|--------|-------------|---------|
| 200 | OK - Sucesso | ✅ Tudo bem |
| 400 | Bad Request - Dados inválidos | ❌ Verifique os dados enviados |
| 404 | Not Found - Rota não existe | ❌ Verifique a URL |
| 500 | Server Error - Erro no Worker | ❌ Redeploye o Worker |
| 403 | Forbidden - Sem permissão | ❌ Verifique autenticação |

---

## 💡 Dicas de Desenvolvimento

### Log de Requisições
No arquivo `main.js`, adicione logs para debug:

```javascript
async function verificarAcesso() {
  const cpf = document.getElementById('input-cpf').value;
  console.log('📡 Enviando CPF:', cpf);
  
  try {
    const response = await fetch(`${WORKER_URL}/api/verificar-cpf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf })
    });
    
    console.log('📊 Status:', response.status);
    const resultado = await response.json();
    console.log('📩 Resposta:', resultado);
    
    // ... resto do código
  } catch (erro) {
    console.error('🔴 Erro:', erro);
  }
}
```

### Testar no DevTools do Browser
1. Abra seu site
2. Pressione **F12** (DevTools)
3. Vá na aba **Network**
4. Interaja com o site
5. Veja as requisições e respostas
6. Clique em cada requisição para ver detalhes

---

## 🚀 Próximas Melhorias

- [ ] Adicionar dashboard para visualizar inspeções
- [ ] Gerar PDF com resultado da inspeção
- [ ] Enviar email com resultado
- [ ] Integrar com banco de dados robusto (PostgreSQL/MySQL)
- [ ] Autenticação com tokens JWT
- [ ] Relatórios de inspeções
- [ ] Sistema de pontuação/multas
