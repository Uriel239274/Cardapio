# Integração com React - Endpoint de Atualização do Menu

Esta pasta contém um exemplo de como integrar o workflow n8n com a aplicação React do cardápio.

## Arquivo de Exemplo: `menu-api-endpoint.js`

Este arquivo mostra como criar um endpoint simples para receber os dados processados pelo workflow n8n e integrá-los com a aplicação React.

## Uso

1. Configure um servidor backend (Express.js, por exemplo)
2. Implemente o endpoint conforme o exemplo
3. Configure o workflow n8n para enviar dados para este endpoint
4. Atualize o estado da aplicação React quando novos dados chegarem

## Exemplo de Integração

```javascript
// Servidor Express.js simples
app.post('/api/menu/update', async (req, res) => {
  const menuData = req.body;
  
  // Processa os dados do workflow n8n
  await updateMenuInDatabase(menuData);
  
  // Notifica clientes conectados (WebSocket, SSE, etc.)
  notifyClientsOfMenuUpdate(menuData);
  
  res.json({ success: true });
});
```

Esta integração permite que mudanças no Google Drive sejam automaticamente refletidas na aplicação React do cardápio.