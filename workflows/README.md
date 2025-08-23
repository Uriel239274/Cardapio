# Workflow n8n - Processador de Arquivos do Google Drive

Este diretório contém os arquivos necessários para configurar um fluxo de trabalho automatizado no n8n que monitora o Google Drive e processa arquivos enviados, extraindo informações e organizando-as em um template predefinido.

## Arquivos Incluídos

### 📋 `drive-file-processor.json`
Arquivo de configuração principal do workflow n8n contendo:
- Nós e conexões do fluxo de trabalho
- Configurações de triggers e processamento
- Lógica de extração e organização de dados

### 📖 `data-template.md`
Documentação detalhada do template de dados, incluindo:
- Estrutura do objeto de saída
- Mapeamento de campos reconhecidos
- Exemplos de uso e formatação
- Guia para personalização

### ⚙️ `setup-instructions.md`
Instruções completas de configuração, contendo:
- Pré-requisitos e dependências
- Configuração passo a passo
- Troubleshooting comum
- Exemplos práticos

## Funcionalidades do Workflow

### 🔍 Monitoramento Automático
- Verifica pasta do Google Drive a cada 5 minutos
- Detecta novos arquivos automaticamente
- Suporte a múltiplos formatos de arquivo

### 📊 Processamento de Dados
- **Planilhas** (CSV, XLSX, XLS): Parse automático com reconhecimento de colunas
- **PDFs**: Extração de texto e identificação de itens/preços
- **Template Unificado**: Organização padronizada dos dados extraídos

### 🔄 Integração e Saída
- Salvamento automático dos resultados no Google Drive
- Envio opcional para API externa
- Webhook para notificações em tempo real

## Como Usar

1. **Instalação**: Importe `drive-file-processor.json` no n8n
2. **Configuração**: Siga as instruções em `setup-instructions.md`
3. **Teste**: Faça upload de arquivos na pasta monitorada
4. **Monitoramento**: Acompanhe execuções na interface do n8n

## Exemplo de Uso - Cardápio de Restaurante

Este workflow é ideal para automatizar a atualização de cardápios:

1. **Upload**: Faça upload de uma planilha com novos itens do menu
2. **Processamento**: O workflow extrai nomes, preços, descrições e categorias
3. **Organização**: Dados são formatados conforme template padrão
4. **Integração**: Resultados podem ser enviados automaticamente para seu sistema

### Exemplo de Planilha de Input:
```csv
nome,descricao,preco,categoria
Hambúrguer Artesanal,Carne 180g com queijo,25.90,Lanches
Cerveja IPA,Cerveja artesanal 500ml,12.00,Bebidas
```

### Exemplo de Output Organizado:
```json
{
  "metadata": {
    "total_items": 2,
    "data_processamento": "2024-01-15T10:30:00.000Z"
  },
  "items": [
    {
      "nome": "Hambúrguer Artesanal",
      "preco": 25.90,
      "categoria": "Lanches"
    }
  ]
}
```

## Requisitos

- n8n (versão 0.230.0+)
- Conta Google com Drive API
- Credenciais OAuth2 configuradas

## Suporte

Para dúvidas ou problemas:
1. Consulte `setup-instructions.md` para troubleshooting
2. Revise logs de execução no n8n
3. Verifique configurações de credenciais e variáveis

---

**Desenvolvido para automação de processamento de dados do Google Drive com n8n**