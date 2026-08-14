# 📖 Guia Completo: Cloudflare Workers + KV para Iniciantes

## ✅ Pré-requisitos
- Conta Cloudflare (gratuita) em https://dash.cloudflare.com
- Seu domínio já configurado no Cloudflare (ou pode usar domínio gratuito .workers.dev)

---

## 🚀 PASSO 1: Criar uma Conta no Cloudflare

1. Acesse https://dash.cloudflare.com
2. Clique em **Sign up** (Registrar)
3. Preencha com seu email e senha
4. Confirme seu email

**Pronto!** Sua conta está criada.

---

## 🛠️ PASSO 2: Criar um Cloudflare Worker

### 2.1 Acessar Workers
1. Na dashboard do Cloudflare, clique em **Workers** (no menu esquerdo)
2. Clique em **Create application** (Criar aplicação)
3. Clique em **Create Worker** (Criar Worker)

### 2.2 Nomear seu Worker
- Nome sugerido: `sistema-inspecao` ou `motoristas-api`
- Clique em **Create service** (Criar serviço)

### 2.3 Copiar o Código
1. Na página do seu novo Worker, você verá um editor de código
2. **Limpe todo o código padrão** (Ctrl+A, Delete)
3. **Cole o código do arquivo `cloudflare-worker.js`** que criei
4. Clique em **Deploy** (Implantar) no canto superior direito

**Parabéns!** Seu Worker foi implantado. 🎉

### 2.4 Copiar a URL do Worker
Após o deploy, você verá a URL como:
```
https://seu-projeto.seu-conta.workers.dev
```

**Guarde essa URL!** Você usará no arquivo `main.js`.

---

## 📦 PASSO 3: Configurar Cloudflare KV (Banco de Dados)

### 3.1 Criar Namespaces KV
1. No Worker, clique em **Settings** (Configurações)
2. No menu esquerdo, clique em **KV namespace bindings**
3. Clique em **Create namespace**

### 3.2 Criar Primeiro Namespace (Motoristas)
- Nome: `MOTORISTAS`
- Clique em **Create**

### 3.3 Criar Segundo Namespace (Inspeções)
- Clique novamente em **Create namespace**
- Nome: `INSPECOES`
- Clique em **Create**

### 3.4 Vincular ao Worker
Você verá:
```
MOTORISTAS | production | Delete
INSPECOES  | production | Delete
```

**Importante:** Certifique-se que ambos estão vinculados ao seu Worker.

---

## 💻 PASSO 4: Configurar seus Arquivos HTML/CSS/JS

### 4.1 Estrutura de Pastas
Crie uma pasta no seu computador com:
```
projeto-inspecao/
├── index.html
├── styles.css
├── main.js
└── GUIA_CLOUDFLARE.md
```

### 4.2 Atualizar a URL do Worker no main.js
Abra o arquivo `main.js` e procure por:
```javascript
const WORKER_URL = 'https://seu-projeto.seu-conta.workers.dev';
```

**Substitua** pela URL real do seu Worker que você copiou no Passo 2.4

### 4.3 Servir os Arquivos
Você pode:

**Opção A: Usar um servidor local (recomendado para testes)**
```bash
# Se tem Python 3 instalado:
python -m http.server 8000

# Se tem Node.js instalado:
npx http-server
```

Depois acesse: `http://localhost:8000`

**Opção B: Publicar no Cloudflare Pages (gratuito)**
1. Vá em https://pages.cloudflare.com
2. Clique em **Create a project**
3. Escolha **Direct upload**
4. Arraste e solte os arquivos (index.html, styles.css, main.js)
5. Clique em **Deploy**

---

## 🧪 PASSO 5: Testar o Sistema

### 5.1 Abra seu site
- Local: http://localhost:8000
- Ou use a URL do Cloudflare Pages se publicou lá

### 5.2 Teste a Primeira Execução
1. **Etapa 1 (CPF):** Digite um CPF de teste: `12345678901`
2. Clique em **Continuar**
3. Sistema deve mostrar **Prova de Conhecimento** (primeira vez)

### 5.3 Teste a Prova
1. Responda todas as 3 questões corretamente:
   - Pergunta 1: **Madeira**
   - Pergunta 2: **Todos os dias**
   - Pergunta 3: **Com o motorista**
2. Clique em **Concluir Prova**
3. Se acertar tudo, vai para **Formulário de Inspeção**

### 5.4 Teste a Inspeção
1. Preencha os campos:
   - Nome: João Silva
   - CNH: 12345678900
   - Placa: ABC-1234
   - Nº Pedido: PED-001
   - Eixos: 2
2. Selecione as opções de inspeção
3. Clique em **Finalizar Inspeção**
4. Deve aparecer mensagem: **✅ Inspeção finalizada com sucesso!**

### 5.5 Teste Segunda Execução
1. Volte para a **Etapa 1**
2. Digite o **mesmo CPF** (12345678901)
3. Clique em **Continuar**
4. Sistema deve ir **direto para Inspeção** (pula a prova)
5. Isso confirma que salvou os dados! 🎉

---

## 🐛 Solução de Problemas

### ❌ Erro: "Erro ao conectar com o servidor"
**Causa:** URL do Worker incorreta
**Solução:** 
1. Copie a URL do Worker novamente
2. Abra browser DevTools (F12)
3. Vá em **Console** e procure pela URL correta
4. Atualize `main.js` com a URL correta

### ❌ Erro: "Cloudflare Worker not found"
**Causa:** Worker não foi deployado
**Solução:**
1. Vá no dashboard do Cloudflare
2. Workers → seu projeto
3. Certifique que tem código e está deployado
4. Clique em **Deploy** novamente

### ❌ Dados não estão salvando no KV
**Causa:** Namespaces não vinculados corretamente
**Solução:**
1. Worker → Settings → KV namespace bindings
2. Verifique se `MOTORISTAS` e `INSPECOES` estão lá
3. Se faltarem, clique em **Add binding**
4. Nome: `MOTORISTAS`, Namespace: escolha MOTORISTAS
5. Repita para `INSPECOES`

### ❌ CORS error
**Causa:** Normalmente resolvido no Worker, mas se persistir:
1. Abra o Worker
2. Certifique que as headers CORS estão corretas no código
3. Se necessário, aumente: `'Access-Control-Allow-Origin': '*'`

---

## 📊 Ver os Dados Salvos

### No Cloudflare Dashboard

1. **Dados de Motoristas:**
   - Workers → seu projeto → KV → MOTORISTAS
   - Veja todos os CPFs salvos

2. **Dados de Inspeções:**
   - Workers → seu projeto → KV → INSPECOES
   - Veja histórico completo

---

## 🔒 Segurança (Importante!)

⚠️ **ANTES de colocar em produção:**

1. **Remova CORS aberto:** Mude de `'*'` para seu domínio:
```javascript
'Access-Control-Allow-Origin': 'https://seusite.com',
```

2. **Adicione autenticação:** Implemente token/API key

3. **Valide dados no backend:** Não confie só no cliente

4. **Use HTTPS:** Cloudflare já oferece gratuitamente

5. **Limite requisições:** Configure rate limiting

---

## 📱 Deploy Final (Recomendado)

### Usar Cloudflare Pages + Workers
1. Publique HTML/CSS/JS no **Cloudflare Pages**
2. Seu **Worker** já está rodando
3. Tudo integrado e gratuito! 🎉

---

## 💰 Custos
- **Cloudflare Workers:** 10 milhões de requisições/mês grátis
- **Cloudflare KV:** 100.000 operações/dia grátis
- **Cloudflare Pages:** Totalmente gratuito

**Seu site é 100% gratuito!** 🎊

---

## 📞 Próximos Passos

1. Teste tudo localmente
2. Verifique dados no KV
3. Configure domínio próprio (opcional)
4. Adicione banco de dados robusto (PostgreSQL) se precisar de mais funcionalidades
5. Implemente dashboard para visualizar inspeções

---

Qualquer dúvida, consulte:
- Docs: https://developers.cloudflare.com/workers/
- KV: https://developers.cloudflare.com/kv/
- Pages: https://developers.cloudflare.com/pages/
