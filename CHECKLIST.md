# ✅ Checklist de Setup - Cloudflare + Site

## 🔐 ETAPA 1: Criar Conta Cloudflare
- [ ] Acesse https://dash.cloudflare.com
- [ ] Crie conta com seu email
- [ ] Confirme email
- [ ] Faça login

---

## 🛠️ ETAPA 2: Criar Worker

### Criar Worker
- [ ] Workers → Create application → Create Worker
- [ ] Nome: `sistema-inspecao`
- [ ] Clique em **Create service**

### Deploy do Código
- [ ] Copie todo código de `cloudflare-worker.js`
- [ ] Cole no editor do Worker (apague o código padrão)
- [ ] Clique em **Deploy**
- [ ] **Copie a URL** → `https://[projeto].[conta].workers.dev`

---

## 📦 ETAPA 3: Configurar KV (Banco de Dados)

### Criar Namespaces
- [ ] Settings → KV namespace bindings
- [ ] Create namespace → Nome: `MOTORISTAS` → Create
- [ ] Create namespace → Nome: `INSPECOES` → Create
- [ ] Verifique se ambos aparecem em "KV namespace bindings"

---

## 📁 ETAPA 4: Preparar Arquivos

### Criar Pasta do Projeto
```
seu-projeto/
├── index.html
├── styles.css
└── main.js
```

### Atualizar main.js
- [ ] Abra `main.js`
- [ ] Procure: `const WORKER_URL = '...'`
- [ ] Substitua pela URL do seu Worker (copiada em ETAPA 2)
- [ ] Salve o arquivo

### Exemplo:
```javascript
const WORKER_URL = 'https://sistema-inspecao.seu-conta.workers.dev';
```

---

## 🚀 ETAPA 5: Testar Localmente

### Opção A: Python (mais fácil)
```bash
# Navigate para pasta do projeto
cd seu-projeto

# Inicie servidor
python -m http.server 8000

# Acesse: http://localhost:8000
```

### Opção B: Node.js
```bash
npx http-server
```

### Opção C: Sem servidor local
- Vá em **Cloudflare Pages**
- **Create a project** → **Direct upload**
- Arraste os 3 arquivos
- Clique em **Deploy**
- Use a URL gerada

---

## 🧪 ETAPA 6: Testes Manuais

### Teste 1: Primeira Vez
1. [ ] Abra o site
2. [ ] Digite CPF: `12345678901`
3. [ ] Clique **Continuar**
4. [ ] Deve aparecer **Prova de Conhecimento**
5. [ ] Responda corretamente (todos Madeira, Todos os dias, Com motorista)
6. [ ] Deve passar para **Inspeção Veicular**

### Teste 2: Segunda Vez (mesmo CPF)
1. [ ] Volte para a primeira etapa
2. [ ] Digite **mesmo CPF**: `12345678901`
3. [ ] Clique **Continuar**
4. [ ] Deve ir **direto para Inspeção** (sem prova)
5. [ ] ✅ Isso confirma que salvou!

### Teste 3: Inspeção Completa
1. [ ] Preencha todos os campos:
   - Nome: João Silva
   - CNH: 12345678900
   - Placa: ABC-1234
   - Pedido: PED-001
   - Eixos: 2
2. [ ] Selecione todas as inspeções
3. [ ] Clique **Finalizar Inspeção**
4. [ ] Deve aparecer: **✅ Inspeção finalizada com sucesso!**

---

## 🔍 ETAPA 7: Verificar Dados no KV

### Visualizar Motoristas
1. [ ] Workers → seu projeto
2. [ ] KV → MOTORISTAS
3. [ ] Procure pela chave: `12345678901`
4. [ ] Veja os dados salvos

### Visualizar Inspeções
1. [ ] Workers → seu projeto
2. [ ] KV → INSPECOES
3. [ ] Procure pelas chaves: `inspecao_12345678901_*`
4. [ ] Veja cada inspeção

---

## 🐛 ETAPA 8: Troubleshooting

### Problema: "Erro ao conectar com o servidor"
- [ ] Verifique a URL do Worker em `main.js`
- [ ] Confirme que o Worker foi deployado
- [ ] Abra DevTools (F12) → Console e procure erros
- [ ] Teste com curl (veja arquivo EXEMPLOS_API.md)

### Problema: Dados não salvam
- [ ] Verifique KV namespaces (Settings → KV namespace bindings)
- [ ] Confirme que MOTORISTAS e INSPECOES estão lá
- [ ] Redeploye o Worker

### Problema: CORS error
- [ ] Código já tem CORS habilitado
- [ ] Se persistir, vá em DevTools → Network
- [ ] Veja a requisição exata que falhou
- [ ] Compare com EXEMPLOS_API.md

### Problema: Prova não valida
- [ ] Respostas devem ser EXATAS:
  - Q1: `Madeira`
  - Q2: `Todos os dias`
  - Q3: `Com o motorista`
- [ ] Maiúsculas/minúsculas importam!

---

## 📊 ETAPA 9: Deploy em Produção

### Opção A: Cloudflare Pages (Recomendado)
1. [ ] https://pages.cloudflare.com
2. [ ] Create project → Direct upload
3. [ ] Arraste: index.html, styles.css, main.js
4. [ ] Deploy
5. [ ] Use a URL gerada

### Opção B: Seu servidor próprio
1. [ ] Copie os 3 arquivos para seu servidor
2. [ ] Configure CORS no Worker se necessário
3. [ ] Configure HTTPS

### Opção C: GitHub Pages + Worker
1. [ ] Publique HTML/CSS/JS no GitHub
2. [ ] Ative GitHub Pages
3. [ ] Worker continua rodando normalmente

---

## ✨ Parabéns!

- [ ] Sistema funcionando? ✅
- [ ] Dados salvando? ✅
- [ ] Prova validando? ✅
- [ ] Inspeção completa? ✅

**Você criou um sistema profissional de inspeção com Cloudflare!** 🎉

---

## 📞 Próximas Etapas (Opcional)

### Adicionar Autenticação
- Implementar login com senha
- Gerar tokens JWT

### Dashboard
- Página para ver histórico de inspeções
- Gráficos de conformidade
- Relatórios PDF

### Melhorias UX
- Offline mode (dados salvam localmente)
- Push notifications
- Temas customizáveis

### Integração
- Enviar emails com resultado
- Integrar com sistema de RH
- API para terceiros

---

## 🆘 Precisa de Ajuda?

1. **DevTools (F12)** → Console → procure por erros
2. **Docs:** https://developers.cloudflare.com/workers/
3. **Arquivo EXEMPLOS_API.md** → veja exemplos de requisições
4. **Arquivo GUIA_CLOUDFLARE.md** → instruções detalhadas

---

**Bom desenvolvimento! 🚀**
