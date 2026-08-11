export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // 1. VERIFICAR MOTORISTA RECORRENTE
    if (url.pathname.startsWith('/verificar-motorista/') && request.method === 'GET') {
      const cpf = url.pathname.split('/').pop();
      const motorista = await env.INSPECOES_DB.get(`mot_${cpf}`);
      return new Response(JSON.stringify({ cadastrado: !!motorista }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 2. SALVAR INSPEÇÃO NO KV
    if (url.pathname === '/salvar-inspecao' && request.method === 'POST') {
      try {
        const body = await request.json();
        const token = "CHK-" + Math.floor(100000 + Math.random() * 900000);
        const dataHora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

        const payloadCompleto = { token, dataHora, ...body };

        // Grava a inspeção vinculada ao Token
        await env.INSPECOES_DB.put(`token_${token}`, JSON.stringify(payloadCompleto));

        // Grava o motorista para liberar em acessos futuros
        await env.INSPECOES_DB.put(`mot_${body.motorista.cpf}`, JSON.stringify({
          cpf: body.motorista.cpf,
          nome: body.motorista.nome,
          ultimoAcesso: dataHora
        }));

        return new Response(JSON.stringify({ status: "SUCESSO", token, statusGeral: body.veiculo.statusGeral }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ status: "ERRO", mensagem: err.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // 3. CONSULTAR TOKEN (PORTARIA/BALANÇA)
    if (url.pathname.startsWith('/consultar-token/') && request.method === 'GET') {
      const token = url.pathname.split('/').pop().toUpperCase();
      const dados = await env.INSPECOES_DB.get(`token_${token}`);

      if (dados) {
        return new Response(JSON.stringify({ encontrado: true, dados: JSON.parse(dados) }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ encontrado: false }), { status: 404, headers: corsHeaders });
    }

    return new Response("Rota não encontrada", { status: 404, headers: corsHeaders });
  }
};
