const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Caminho para salvar os dados do menu
const MENU_DATA_PATH = path.join(__dirname, '../../src/data/menu.json');

/**
 * Endpoint para receber dados processados do workflow n8n
 * POST /api/menu/update
 */
app.post('/api/menu/update', async (req, res) => {
  try {
    const menuData = req.body;
    
    // Validação básica dos dados recebidos
    if (!menuData || !menuData.metadata || !menuData.items) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos: metadata e items são obrigatórios'
      });
    }

    console.log(`Recebidos ${menuData.items.length} itens de menu do workflow n8n`);
    
    // Processa e valida os itens do menu
    const processedItems = menuData.items.map(item => ({
      id: item.id || generateId(),
      nome: item.nome || 'Item sem nome',
      descricao: item.descricao || '',
      preco: parseFloat(item.preco) || 0,
      categoria: item.categoria || 'Outros',
      disponivel: item.disponivel !== false,
      imagem: item.imagem || '',
      ingredientes: item.ingredientes || '',
      observacoes: item.observacoes || '',
      dataAtualizacao: new Date().toISOString(),
      fonte: item.fonte || 'Workflow n8n',
      arquivoOrigem: item.arquivo_origem || ''
    }));

    // Organiza os dados para a aplicação React
    const reactMenuData = {
      metadata: {
        ...menuData.metadata,
        ultimaAtualizacao: new Date().toISOString(),
        totalItens: processedItems.length
      },
      categorias: organizarPorCategoria(processedItems),
      items: processedItems,
      estatisticas: calcularEstatisticas(processedItems)
    };

    // Salva os dados em arquivo JSON para a aplicação React
    await salvarDadosMenu(reactMenuData);

    // Opcional: Notificar clientes conectados via WebSocket
    // notifyWebSocketClients(reactMenuData);

    // Opcional: Enviar notificação para Slack/Discord
    // await enviarNotificacao(menuData);

    res.json({
      success: true,
      message: 'Menu atualizado com sucesso',
      totalItens: processedItems.length,
      categorias: Object.keys(reactMenuData.categorias),
      dataProcessamento: menuData.metadata.data_processamento
    });

  } catch (error) {
    console.error('Erro ao processar atualização do menu:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

/**
 * Endpoint para obter dados atuais do menu
 * GET /api/menu
 */
app.get('/api/menu', async (req, res) => {
  try {
    const menuData = await lerDadosMenu();
    res.json(menuData);
  } catch (error) {
    console.error('Erro ao obter dados do menu:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao carregar dados do menu'
    });
  }
});

/**
 * Endpoint para obter estatísticas do menu
 * GET /api/menu/stats
 */
app.get('/api/menu/stats', async (req, res) => {
  try {
    const menuData = await lerDadosMenu();
    res.json({
      totalItens: menuData.items?.length || 0,
      totalCategorias: Object.keys(menuData.categorias || {}).length,
      precoMedio: menuData.estatisticas?.precoMedio || 0,
      ultimaAtualizacao: menuData.metadata?.ultimaAtualizacao,
      itensDisponiveis: menuData.items?.filter(item => item.disponivel).length || 0
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao carregar estatísticas'
    });
  }
});

// Funções auxiliares

function organizarPorCategoria(items) {
  return items.reduce((acc, item) => {
    const categoria = item.categoria;
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(item);
    return acc;
  }, {});
}

function calcularEstatisticas(items) {
  const itensComPreco = items.filter(item => item.preco > 0);
  const precoMedio = itensComPreco.length > 0 
    ? itensComPreco.reduce((sum, item) => sum + item.preco, 0) / itensComPreco.length 
    : 0;

  return {
    totalItens: items.length,
    itensComPreco: itensComPreco.length,
    precoMedio: Math.round(precoMedio * 100) / 100,
    precoMinimo: Math.min(...itensComPreco.map(item => item.preco)),
    precoMaximo: Math.max(...itensComPreco.map(item => item.preco)),
    itensDisponiveis: items.filter(item => item.disponivel).length
  };
}

async function salvarDadosMenu(menuData) {
  // Cria o diretório se não existir
  const dir = path.dirname(MENU_DATA_PATH);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }

  // Salva os dados
  await fs.writeFile(MENU_DATA_PATH, JSON.stringify(menuData, null, 2), 'utf8');
  console.log('Dados do menu salvos em:', MENU_DATA_PATH);
}

async function lerDadosMenu() {
  try {
    const data = await fs.readFile(MENU_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Arquivo de menu não encontrado, retornando dados vazios');
    return {
      metadata: { ultimaAtualizacao: new Date().toISOString() },
      categorias: {},
      items: [],
      estatisticas: {}
    };
  }
}

function generateId() {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Opcional: Função para notificar via WebSocket
function notifyWebSocketClients(menuData) {
  // Implementar WebSocket se necessário
  console.log('Notificação WebSocket:', menuData.metadata);
}

// Opcional: Função para enviar notificação externa
async function enviarNotificacao(menuData) {
  // Implementar notificação para Slack, Discord, etc.
  console.log(`Menu atualizado: ${menuData.items.length} itens processados`);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Menu API Endpoint' 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor da API do menu rodando na porta ${PORT}`);
  console.log(`📝 Endpoint principal: POST http://localhost:${PORT}/api/menu/update`);
  console.log(`📊 Dados do menu: GET http://localhost:${PORT}/api/menu`);
  console.log(`❤️ Health check: GET http://localhost:${PORT}/health`);
});

module.exports = app;