# Configuração do Fluxo de Trabalho n8n - Processador de Arquivos do Drive

Este documento fornece instruções passo a passo para configurar e usar o fluxo de trabalho n8n que monitora o Google Drive e processa automaticamente arquivos enviados.

## Pré-requisitos

1. **n8n instalado e funcionando**
   - Versão mínima: 0.230.0
   - Acesso à interface web do n8n

2. **Conta Google com Drive API habilitada**
   - Projeto no Google Cloud Platform
   - Credenciais OAuth2 configuradas

3. **Acesso aos arquivos de workflow**
   - `drive-file-processor.json` - Configuração principal do workflow
   - `data-template.md` - Documentação do template de dados

## Configuração Inicial

### 1. Configurar Credenciais do Google Drive

1. Acesse a interface do n8n
2. Vá para **Settings > Credentials**
3. Clique em **Add Credential**
4. Selecione **Google Drive OAuth2 API**
5. Preencha com suas credenciais:
   - **Client ID**: Seu Google OAuth2 Client ID
   - **Client Secret**: Seu Google OAuth2 Client Secret
   - **Scope**: `https://www.googleapis.com/auth/drive`
6. Autorize o acesso à sua conta Google
7. Anote o ID das credenciais criadas

### 2. Configurar Variáveis de Ambiente

No n8n, vá para **Settings > Environments** e configure:

```
DRIVE_FOLDER_ID=ID_da_pasta_do_drive_para_monitorar
OUTPUT_FOLDER_ID=ID_da_pasta_para_salvar_resultados
GOOGLE_DRIVE_CREDENTIALS_ID=ID_das_credenciais_criadas
MENU_API_ENDPOINT=http://localhost:3000/api/menu/update
API_TOKEN=seu_token_de_api_opcional
```

#### Como obter IDs de pastas do Google Drive:
1. Abra o Google Drive no navegador
2. Navegue até a pasta desejada
3. Copie o ID da URL (parte após `/folders/`)
   - Exemplo: `https://drive.google.com/drive/folders/1ABC123def456` → ID: `1ABC123def456`

### 3. Importar o Workflow

1. Na interface do n8n, clique em **Import**
2. Selecione o arquivo `drive-file-processor.json`
3. Confirme a importação
4. Verifique se todas as conexões estão corretas

### 4. Configurar Nós Específicos

#### Nó "Schedule Trigger"
- **Intervalo**: 5 minutos (ajustável conforme necessidade)
- **Timezone**: Configure para seu fuso horário

#### Nó "Google Drive - List Files"
- Verifique se as credenciais estão selecionadas
- Confirme se `DRIVE_FOLDER_ID` está configurado corretamente

#### Nó "HTTP Request - Send to Menu API" (Opcional)
- Configure apenas se você tiver uma API para receber os dados
- Ajuste o endpoint e headers conforme sua API

## Uso do Workflow

### Tipos de Arquivo Suportados

1. **Planilhas** (`.csv`, `.xlsx`, `.xls`)
   - Devem ter cabeçalhos na primeira linha
   - Consulte `data-template.md` para nomes de colunas reconhecidos

2. **PDFs** (`.pdf`)
   - O texto será extraído automaticamente
   - Melhor funcionamento com PDFs com texto selecionável

### Estrutura Recomendada da Planilha

```csv
nome,descricao,preco,categoria,disponivel,ingredientes,observacoes
Hambúrguer Artesanal,Hambúrguer 180g com queijo,25.90,Lanches,TRUE,Carne queijo alface tomate,Ponto da carne a escolher
```

### Processo de Execução

1. **Upload de Arquivo**: Coloque o arquivo na pasta monitorada do Google Drive
2. **Detecção**: O workflow verifica novos arquivos a cada 5 minutos
3. **Download**: Arquivos novos são baixados automaticamente
4. **Processamento**: 
   - Planilhas são parseadas
   - PDFs têm texto extraído
   - Dados são organizados conforme template
5. **Saída**: 
   - Dados organizados são salvos no Drive
   - Opcionalmente enviados para API configurada

## Monitoramento e Logs

### Verificar Execuções
1. No n8n, vá para **Executions**
2. Visualize execuções recentes do workflow
3. Clique em uma execução para ver detalhes e logs

### Debugging Comum

**Workflow não executa**:
- Verifique se está ativado (toggle no canto superior direito)
- Confirme credenciais do Google Drive
- Verifique variáveis de ambiente

**Arquivos não são processados**:
- Confirme `DRIVE_FOLDER_ID` correto
- Verifique se arquivos são dos tipos suportados
- Veja logs de execução para erros específicos

**Dados não são extraídos corretamente**:
- Revise estrutura da planilha
- Consulte `data-template.md` para nomes de colunas
- Para PDFs, certifique-se que contêm texto selecionável

## Personalização

### Alterar Frequência de Monitoramento
No nó "Schedule Trigger", ajuste o intervalo conforme necessário:
- Mínimo recomendado: 1 minuto
- Para economia de recursos: 15-30 minutos

### Adicionar Novos Tipos de Arquivo
1. Adicione nova condição no nó "IF - File Type Check"
2. Crie novo ramo de processamento
3. Conecte ao nó "Code - Organize Data Template"

### Modificar Template de Dados
Edite o código JavaScript no nó "Code - Organize Data Template" para:
- Alterar campos do template
- Adicionar validações
- Modificar lógica de extração

## Segurança

- Mantenha credenciais seguras
- Use tokens de API com escopo limitado
- Monitore logs regularmente
- Configure backup das configurações do workflow

## Suporte e Troubleshooting

Para problemas específicos:
1. Verifique logs de execução no n8n
2. Confirme permissões no Google Drive
3. Teste com arquivos de exemplo simples
4. Consulte documentação oficial do n8n

### Arquivos de Exemplo para Teste

Crie uma planilha CSV simples para teste:
```csv
nome,preco,categoria
Teste Item,10.50,Teste
```

Salve como `teste_menu.csv` e faça upload na pasta monitorada.