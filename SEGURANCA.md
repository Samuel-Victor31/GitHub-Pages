# 🔒 Segurança e Boas Práticas

## ⚠️ IMPORTANTE: Segurança em Produção

Este projeto é perfeito para **desenvolvimento e testes**, mas se você pretende usar em produção com dados reais, implemente as seguintes melhorias:

---

## 🔐 1. Autenticação e Autorização

### Problema Atual
- Qualquer pessoa pode consultar dados de qualquer motorista
- Não há verificação de identidade

### Solução: Implementar Autenticação
```javascript
// Adicionar ao Worker:
const ADMIN_KEY = 'sua-chave-secreta-super-segura-aqui';

export default {
  async fetch(request, env, ctx) {
    // Verificar autenticação
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${ADMIN_KEY}`) {
      return new Response(
        JSON.stringify({ erro: 'Não autorizado' }), 
        { status: 403, headers: corsHeaders }
      );
    }
    
    // Resto do código...
  }
};
```

### No Cliente (main.js):
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer seu-token-aqui`
};

fetch(WORKER_URL + endpoint, {
  method: 'POST',
  headers,
  body: JSON.stringify(dados)
});
```

---

## 🛡️ 2. Validação de Dados

### Problema Atual
- Não valida tamanho/formato de CPF
- Não sanitiza entradas

### Solução: Validar no Worker
```javascript
// Adicionar ao Worker:
function validarCPF(cpf) {
  // Apenas números, 11 dígitos
  if (!/^\d{11}$/.test(cpf)) {
    return false;
  }
  
  // Algoritmo de validação CPF (opcional)
  let sum = 0;
  let remainder;
  
  if (cpf == "00000000000") return false;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder == 10 || remainder == 11) remainder = 0;
  if (remainder != parseInt(cpf.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder == 10 || remainder == 11) remainder = 0;
  if (remainder != parseInt(cpf.substring(10, 11))) return false;
  
  return true;
}

// Usar na função:
if (!validarCPF(cpf)) {
  return new Response(
    JSON.stringify({ erro: 'CPF inválido' }), 
    { status: 400, headers: corsHeaders }
  );
}
```

---

## 🔐 3. CORS Restritivo

### Problema Atual
```javascript
'Access-Control-Allow-Origin': '*'  // ❌ Aberto demais!
```

### Solução: Restringir Domínios
```javascript
// No Worker, detectar origem:
const origin = request.headers.get('Origin');
const allowedOrigins = [
  'https://seusite.com',
  'https://app.seusite.com',
  'http://localhost:8000'  // Desenvolvimento
];

const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};
```

---

## 🌐 4. Rate Limiting

### Implementar limite de requisições por IP/CPF

```javascript
// Simples rate limiting com KV:
async function checkRateLimit(ip, env) {
  const key = `ratelimit:${ip}`;
  const current = await env.RATE_LIMIT.get(key);
  const count = parseInt(current || 0);
  
  if (count > 100) {  // Máximo 100 requisições
    return false;  // Bloqueado
  }
  
  await env.RATE_LIMIT.put(key, count + 1, { expirationTtl: 3600 });
  return true;
}

// Usar:
const ip = request.headers.get('CF-Connecting-IP');
if (!await checkRateLimit(ip, env)) {
  return new Response(
    JSON.stringify({ erro: 'Muitas requisições. Tente mais tarde.' }),
    { status: 429, headers: corsHeaders }
  );
}
```

---

## 🔒 5. Criptografia de Dados Sensíveis

### Importante: CPF e CNH são dados sensíveis!

```javascript
// Exemplo com crypto básico:
import { nanoid } from 'nanoid';

// Ao salvar:
const motorista = {
  id: nanoid(),  // ID aleatório em vez de CPF
  cpf_hash: await hashCPF(cpf),  // Hash do CPF
  nome_criptografado: encryptData(nome, CHAVE_SECRETA),
  cnh_criptografado: encryptData(cnh, CHAVE_SECRETA),
  data_criacao: new Date().toISOString()
};

// Funções:
async function hashCPF(cpf) {
  const encoder = new TextEncoder();
  const data = encoder.encode(cpf);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  // Converter para hex...
  return arrayBufferToHex(hashBuffer);
}
```

---

## 📋 6. Logging e Auditoria

### Registrar todas as ações importantes

```javascript
async function registrarAcao(env, acao, dados, usuario) {
  const log = {
    timestamp: new Date().toISOString(),
    acao,
    usuario,
    dados_resumo: {
      cpf: dados.cpf?.slice(-4) + '****',  // Ocultar CPF
      tipo: dados.tipo
    }
  };
  
  await env.LOGS.put(
    `log_${Date.now()}`,
    JSON.stringify(log),
    { expirationTtl: 7776000 }  // 90 dias
  );
}

// Usar:
await registrarAcao(env, 'verificar_cpf', { cpf }, usuarioIP);
```

---

## 🔄 7. Backups e Recuperação

### Exportar dados regularmente

```javascript
// Rota para export (apenas admin):
if (url.pathname === '/api/export-dados' && request.method === 'POST') {
  // Verificar autenticação
  if (!isAdmin(request)) {
    return new Response('Forbidden', { status: 403 });
  }
  
  const motoristas = await env.MOTORISTAS.list();
  const inspecoes = await env.INSPECOES.list();
  
  const backup = {
    data: new Date().toISOString(),
    motoristas: motoristas.keys,
    inspecoes: inspecoes.keys,
    total_motoristas: motoristas.keys.length,
    total_inspecoes: inspecoes.keys.length
  };
  
  return new Response(JSON.stringify(backup, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="backup.json"'
    }
  });
}
```

---

## 🔴 8. Tratamento de Erros

### Não expor detalhes internos

```javascript
// ❌ Errado:
catch (erro) {
  return new Response(JSON.stringify({
    erro: erro.message,
    stack: erro.stack  // ⚠️ Expõe código!
  }), { status: 500 });
}

// ✅ Correto:
catch (erro) {
  console.error('[ERRO]', erro);  // Log interno
  return new Response(JSON.stringify({
    erro: 'Erro ao processar requisição. Tente novamente.'
  }), { status: 500 });
}
```

---

## 🔐 9. HTTPS e Certificados

### Cloudflare já oferece:
- ✅ HTTPS automático (gratuito)
- ✅ Renovação automática de certificados
- ✅ Proteção DDoS

Nada a fazer! Já está seguro.

---

## 📱 10. Validação no Cliente

### Não confie apenas em validação do cliente

```javascript
// Cliente pode ser manipulado!
// Sempre valide no servidor (Worker)

// ✅ Bom: Validar nos dois lados
// Cliente → mostrar feedback imediato
// Servidor → rejeitar dados inválidos
```

---

## 🚨 11. Checklist de Segurança

- [ ] Implementar autenticação com tokens
- [ ] Validar todos os dados de entrada
- [ ] Usar CORS restritivo
- [ ] Implementar rate limiting
- [ ] Criptografar dados sensíveis (CPF, CNH)
- [ ] Manter logs de auditoria
- [ ] Fazer backups regulares
- [ ] Nunca expor stack trace ao cliente
- [ ] Usar HTTPS (Cloudflare oferece)
- [ ] Testar segurança regularmente

---

## 🔐 12. Exemplo Seguro Melhorado

```javascript
// Worker melhorado com segurança:

const ADMIN_KEY = process.env.ADMIN_API_KEY;
const ALLOWED_ORIGINS = ['https://seusite.com'];

export default {
  async fetch(request, env, ctx) {
    // 1. Verificar CORS
    const origin = request.headers.get('Origin');
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    // 2. Verificar autenticação
    const auth = request.headers.get('Authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401 });
    }

    // 3. Rate limiting
    const ip = request.headers.get('CF-Connecting-IP');
    if (!await checkRateLimit(ip, env)) {
      return new Response('Too Many Requests', { status: 429 });
    }

    // 4. Rotear requisição
    const url = new URL(request.url);
    
    if (url.pathname === '/api/verificar-cpf') {
      const { cpf } = await request.json();
      
      // 5. Validar dados
      if (!validarCPF(cpf)) {
        return new Response(
          JSON.stringify({ erro: 'CPF inválido' }),
          { status: 400 }
        );
      }

      // 6. Registrar ação
      await registrarAcao(env, 'verificar_cpf', { cpf }, ip);

      // 7. Processar
      const motorista = await env.MOTORISTAS.get(cpf);
      
      // ... resto seguro ...
    }

    return new Response('Not Found', { status: 404 });
  }
};
```

---

## 📚 Recursos de Segurança

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Cloudflare Security Docs](https://developers.cloudflare.com/workers/platform/security/)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)

---

**Segurança é um processo contínuo. Atualize regularmente!** 🔒
