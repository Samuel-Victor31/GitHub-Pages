// Cloudflare Worker - Cole este código no seu Worker
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS setup
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ROTA 1: Verificar se CPF existe
    if (url.pathname === '/api/verificar-cpf' && request.method === 'POST') {
      const { cpf } = await request.json();
      
      if (!cpf || cpf.length !== 11) {
        return new Response(JSON.stringify({ erro: 'CPF inválido' }), { 
          status: 400, 
          headers: corsHeaders 
        });
      }

      // Buscar no KV
      const motorista = await env.MOTORISTAS.get(cpf);

      if (motorista) {
        // CPF já existe - usuário recorrente
        return new Response(JSON.stringify({
          existe: true,
          dados: JSON.parse(motorista)
        }), { headers: corsHeaders });
      } else {
        // Primeira vez - vai fazer prova
        return new Response(JSON.stringify({
          existe: false,
          mensagem: 'Novo motorista - realize a prova'
        }), { headers: corsHeaders });
      }
    }

    // ROTA 2: Salvar motorista + resultado da prova
    if (url.pathname === '/api/salvar-motorista' && request.method === 'POST') {
      const { cpf, nome, cnh, placa, prova_respondida } = await request.json();

      const dadosMotorista = {
        cpf,
        nome,
        cnh,
        placa,
        prova_respondida,
        data_criacao: new Date().toISOString(),
        primeiroAcesso: true
      };

      // Salvar no KV (expira em 365 dias)
      await env.MOTORISTAS.put(
        cpf, 
        JSON.stringify(dadosMotorista),
        { expirationTtl: 31536000 }
      );

      return new Response(JSON.stringify({
        sucesso: true,
        mensagem: 'Motorista registrado com sucesso'
      }), { headers: corsHeaders });
    }

    // ROTA 3: Salvar inspeção veicular
    if (url.pathname === '/api/salvar-inspecao' && request.method === 'POST') {
      const { cpf, inspecao_dados } = await request.json();

      // Chave para histórico de inspeções
      const chave_inspecao = `inspecao_${cpf}_${Date.now()}`;

      const inspecao = {
        cpf,
        ...inspecao_dados,
        data_inspecao: new Date().toISOString()
      };

      await env.INSPECOES.put(chave_inspecao, JSON.stringify(inspecao), {
        expirationTtl: 31536000
      });

      return new Response(JSON.stringify({
        sucesso: true,
        id_inspecao: chave_inspecao,
        mensagem: 'Inspeção salva com sucesso'
      }), { headers: corsHeaders });
    }

    // ROTA 4: Obter histórico de inspeções
    if (url.pathname === '/api/historico-inspecoes' && request.method === 'POST') {
      const { cpf } = await request.json();
      
      // Buscar todas as inspeções do motorista
      const lista = await env.INSPECOES.list({ prefix: `inspecao_${cpf}_` });

      const inspecoes = [];
      for (const item of lista.keys) {
        const inspecao = await env.INSPECOES.get(item.name);
        inspecoes.push(JSON.parse(inspecao));
      }

      return new Response(JSON.stringify({
        inspecoes: inspecoes.sort((a, b) => new Date(b.data_inspecao) - new Date(a.data_inspecao))
      }), { headers: corsHeaders });
    }

    // Rota padrão
    return new Response(JSON.stringify({ erro: 'Rota não encontrada' }), {
      status: 404,
      headers: corsHeaders
    });
  }
};
