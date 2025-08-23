# Template de Dados para Extração de Menu

Este arquivo define o template padrão utilizado pelo fluxo de trabalho n8n para organizar os dados extraídos dos arquivos enviados ao Google Drive.

## Estrutura do Template

### Objeto Principal
```json
{
  "metadata": {
    "total_items": number,
    "data_processamento": "ISO DateTime",
    "versao_template": "string",
    "origem": "string"
  },
  "categorias": ["string array"],
  "items": [array de itens],
  "resumo_por_categoria": {objeto com estatísticas}
}
```

### Estrutura de Item Individual
```json
{
  "id": "string - identificador único",
  "nome": "string - nome do item do menu",
  "descricao": "string - descrição detalhada",
  "preco": number - preço em formato numérico,
  "categoria": "string - categoria do item",
  "disponivel": boolean - se está disponível,
  "imagem": "string - URL ou caminho da imagem",
  "ingredientes": "string - lista de ingredientes",
  "observacoes": "string - observações especiais",
  "data_atualizacao": "ISO DateTime",
  "fonte": "string - origem dos dados",
  "arquivo_origem": "string - nome do arquivo original"
}
```

## Mapeamento de Campos Reconhecidos

### Para Planilhas (CSV, XLSX, XLS)
O workflow reconhece automaticamente os seguintes nomes de colunas:

- **Nome do item**: `nome`, `name`, `item`, `produto`
- **Descrição**: `descricao`, `description`, `desc`
- **Preço**: `preco`, `price`, `valor`, `cost`
- **Categoria**: `categoria`, `category`, `tipo`
- **Disponibilidade**: `disponivel`, `available`
- **Imagem**: `imagem`, `image`, `foto`
- **Ingredientes**: `ingredientes`, `ingredients`
- **Observações**: `observacoes`, `notes`, `obs`

### Para PDFs
O workflow tenta extrair automaticamente:
- Nomes de itens (linhas antes de preços)
- Preços (números precedidos por R$, $, ou padrões numéricos)
- Descrições (linhas após nomes, quando não contêm preços)

## Exemplo de Planilha Recomendada

| nome | descricao | preco | categoria | disponivel | ingredientes | observacoes |
|------|-----------|-------|-----------|------------|--------------|-------------|
| Hambúrguer Artesanal | Hambúrguer 180g com queijo | 25.90 | Lanches | TRUE | Carne, queijo, alface, tomate | Ponto da carne a escolher |
| Cerveja Artesanal IPA | Cerveja amarga 500ml | 12.00 | Bebidas | TRUE | Lúpulo, malte, água | Gelada |

## Categorias Padrão Sugeridas

- Lanches
- Bebidas
- Pratos Principais
- Sobremesas
- Entradas
- Cervejas
- Drinks
- Caldos
- Espetos
- Porções
- Outros

## Exemplo de Saída Processada

```json
{
  "metadata": {
    "total_items": 2,
    "data_processamento": "2024-01-15T10:30:00.000Z",
    "versao_template": "1.0.0",
    "origem": "Google Drive Automation"
  },
  "categorias": ["Lanches", "Bebidas"],
  "items": [
    {
      "id": "item_1705316200000_abc123",
      "nome": "Hambúrguer Artesanal",
      "descricao": "Hambúrguer 180g com queijo",
      "preco": 25.90,
      "categoria": "Lanches",
      "disponivel": true,
      "imagem": "",
      "ingredientes": "Carne, queijo, alface, tomate",
      "observacoes": "Ponto da carne a escolher",
      "data_atualizacao": "2024-01-15T10:30:00.000Z",
      "fonte": "Google Drive - Planilha",
      "arquivo_origem": "menu_janeiro_2024.xlsx"
    }
  ],
  "resumo_por_categoria": {
    "Lanches": {
      "total_items": 1,
      "preco_medio": 25.90,
      "items": ["item_1705316200000_abc123"]
    }
  }
}
```

## Integração com API

O template processado pode ser enviado automaticamente para um endpoint de API configurado nas variáveis do n8n:

- `MENU_API_ENDPOINT`: URL do endpoint que receberá os dados
- `API_TOKEN`: Token de autenticação para a API

## Personalização

Para personalizar o template, edite o código JavaScript no nó "Code - Organize Data Template" no workflow n8n.