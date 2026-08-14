# 🚗 Sistema de Inspeção Veicular com Cloudflare

Um sistema completo e gratuito para gerenciar inspeções de frota veicular com validação de motoristas, prova de conhecimento e armazenamento em banco de dados na nuvem.

## ✨ Funcionalidades

### ✅ Autenticação por CPF
- Verifica se motorista já existe no sistema
- Primeira vez → mostra prova obrigatória
- Usuário recorrente → vai direto para inspeção

### 📋 Prova de Conhecimento (1º Acesso)
- 3 questões sobre normas de segurança
- Exige 100% de acerto para continuar
- Dados salvos permanentemente

### 🔍 Checklist de Inspeção
- 7 itens de verificação veicular
- Informações do motorista e veículo
- Gerador de ID único para cada inspeção

### 💾 Banco de Dados em Nuvem
- Cloudflare KV Storage (gratuito)
- Armazena motoristas e inspeções
- Sem limite de tamanho sensato
- Automaticamente sincronizado

## 🚀 Stack Tecnológico

```
Frontend:      HTML5 + CSS3 + JavaScript puro
Backend:       Cloudflare Workers
Banco de Dados: Cloudflare KV
Hospedagem:    Cloudflare Pages (opcional)
Custo:         100% Gratuito
```

## 📁 Estrutura do Projeto

```
sistema-inspecao/
├── index.html                  # Interface principal
├── styles.css                  # Estilos modernos
├── main.js                     # Lógica do cliente
├── cloudflare-worker.js        # Backend (Cloudflare)
├── README.md                   # Este arquivo
├── GUIA_CLOUDFLARE.md          # Setup detalhado
├── CHECKLIST.md                # Checklist rápido ✅
├── EXEMPLOS_API.md             # Referência de API
├── SEGURANCA.md                # Dicas de segurança
└── CONTROLE_AULAS.md           # (Opcional) Rastreio de aulas
```

## 🎯 Comece em 5 Minutos

### 1. Clone ou baixe os arquivos
```bash
git clone <seu-repo>
# ou baixe os arquivos .html, .css, .js
```

### 2. Crie uma conta Cloudflare
Acesse https://dash.cloudflare.com → Sign up

### 3. Deploy do Worker
- Workers → Create Application → Create Worker
- Cole o código de `cloudflare-worker.js`
- Clique em **Deploy**
- Copie a URL do seu Worker

### 4. Configure KV
- Worker → Settings → KV namespace bindings
- Crie 2 namespaces: `MOTORISTAS` e `INSPECOES`

### 5. Atualize main.js
```javascript
const WORKER_URL = 'https://seu-worker.workers.dev';
```

### 6. Teste localmente
```bash
python -m http.server 8000
# Acesse http://localhost:8000
```

**Pronto! Sistema funcionando!** 🎉

## 📖 Documentação

| Arquivo | Conteúdo |
|---------|----------|
| **GUIA_CLOUDFLARE.md** | Setup passo a passo detalhado |
| **CHECKLIST.md** | Checklist rápido de verificação |
| **EXEMPLOS_API.md** | Exemplos de chamadas de API |
| **SEGURANCA.md** | Dicas para usar em produção |

**Comece com o CHECKLIST.md se quer setup rápido!** ⚡

## 🧪 Testando o Sistema

### Teste 1: Primeiro Acesso
```
1. Digite CPF: 12345678901
2. Clique Continuar
3. Responda a prova (Madeira, Todos os dias, Com motorista)
4. Preencha inspeção e finalize
```

### Teste 2: Acesso Recorrente
```
1. Digite MESMO CPF: 12345678901
2. Clique Continuar
3. Sistema pula prova (já passou)
4. Vai direto para inspeção
```

### Teste 3: Verificar Dados
```
1. Workers → seu projeto
2. KV → MOTORISTAS → procure por 12345678901
3. Veja dados salvos
```

## 🔒 Segurança

### Desenvolvimento
- ✅ Perfeito para testes e prototipagem
- ✅ CORS aberto para facilitar testes

### Produção
- ⚠️ Implemente autenticação com tokens
- ⚠️ Restrinja CORS para seu domínio
- ⚠️ Valide CPF/CNH com algoritmo real
- ⚠️ Criptografe dados sensíveis

**Veja SEGURANCA.md para detalhes!**

## 💰 Custos

| Serviço | Limite Gratuito | Custo |
|---------|-----------------|-------|
| Workers | 10M requisições/mês | Grátis |
| KV | 100K ops/dia | Grátis |
| Pages | Ilimitado | Grátis |
| **Total** | **Suficiente para PME** | **Grátis!** |

Escala: ~1.000 motoristas + 5.000 inspeções/mês = **Grátis permanente** 🎊

## 📊 Arquitetura

```
┌─────────────────────┐
│   Cliente HTML      │
│  (index.html)       │
│   - Etapa 1: CPF    │
│   - Etapa 2: Prova  │
│   - Etapa 3: Check  │
└──────────┬──────────┘
           │
           │ HTTP/HTTPS
           ▼
┌─────────────────────┐
│ Cloudflare Worker   │
│ (API Backend)       │
│  - Verificar CPF    │
│  - Salvar dados     │
│  - Validar prova    │
└──────────┬──────────┘
           │
           │ Read/Write
           ▼
┌─────────────────────┐
│  Cloudflare KV      │
│ (Banco de Dados)    │
│  MOTORISTAS    |    │
│  INSPECOES     |    │
└─────────────────────┘
```

## 🛠️ Troubleshooting

### "Erro ao conectar com o servidor"
→ Verifique URL do Worker em `main.js`

### "Dados não salvam"
→ Verifique KV namespaces em Settings

### "CORS error"
→ Já resolvido no Worker, se persistir veja SEGURANCA.md

### "Prova não valida"
→ Respostas devem ser: Madeira, Todos os dias, Com motorista

**Mais problemas?** Veja **GUIA_CLOUDFLARE.md** seção "Solução de Problemas"

## 🚀 Deploy em Produção

### Opção A: Cloudflare Pages (Recomendado)
```
1. https://pages.cloudflare.com
2. Direct upload
3. Arraste index.html, styles.css, main.js
4. Deploy automático
5. Recebe domínio .pages.dev
```

### Opção B: Seu Servidor
```
1. Copie arquivos para seu servidor
2. Configure CORS no Worker (veja SEGURANCA.md)
3. Use domínio próprio
4. Ative HTTPS
```

### Opção C: GitHub Pages
```
1. Publique no GitHub
2. Ative GitHub Pages
3. Worker continua funcionando
4. Tudo integrado
```

## 📈 Próximas Melhorias

- [ ] Dashboard com histórico de inspeções
- [ ] Relatórios em PDF
- [ ] Envio de email com resultado
- [ ] Gráficos de conformidade
- [ ] Autenticação com senha
- [ ] Sistema de multas/pontuação
- [ ] Integração com RH
- [ ] App móvel

## 📞 Suporte

1. **Dúvidas de setup?** → Veja CHECKLIST.md
2. **Integração API?** → Veja EXEMPLOS_API.md
3. **Segurança?** → Veja SEGURANCA.md
4. **Erros?** → Veja GUIA_CLOUDFLARE.md seção troubleshooting

## 📄 Licença

Este projeto é fornecido como está, para fins educacionais e comerciais.

## 🎓 Aprendizado

Este projeto ensina:
- ✅ Criar APIs com Cloudflare Workers
- ✅ Usar KV Storage como banco de dados
- ✅ Arquitetura serverless
- ✅ Validação de dados
- ✅ Deploy em produção
- ✅ Segurança de aplicações

## 🙏 Créditos

Construído com:
- Cloudflare Workers (Backend)
- Cloudflare KV (Database)
- HTML5/CSS3/JavaScript (Frontend)
- ❤️ Paixão por código limpo

## 📞 Contato

Dúvidas ou sugestões? Entre em contato!

---

**Versão:** 1.0  
**Última atualização:** Janeiro 2024  
**Status:** Pronto para produção

**Comece agora!** 🚀 Siga o **CHECKLIST.md** para setup rápido.
