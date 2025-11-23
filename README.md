# Tupana - Plugin OctoPrint
https://github.com/tonymichaelb/cores/archive/main.zip
Plugin para gerenciamento de cores no OctoPrint.

## Descrição

Tupana adiciona uma nova aba chamada "Cores" ao lado das abas Control e Temperature no OctoPrint, permitindo configurar e visualizar diferentes esquemas de cores.

## Características

- Interface de seleção de cores intuitiva
- Três cores configuráveis (primária, secundária, terciária)
- Visualização em tempo real das cores selecionadas
- Persistência das cores usando localStorage
- Design responsivo

## Instalação

### Manual

1. Clone este repositório ou baixe os arquivos
2. Navegue até a pasta do plugin
3. Instale via pip:

```bash
pip install .
```

### Via URL

Você também pode instalar diretamente via Plugin Manager do OctoPrint usando a URL do repositório.

## Estrutura do Plugin

```
octoprint_tupana/
├── __init__.py                 # Classe principal do plugin
├── templates/
│   └── tupana_tab.jinja2      # Template HTML da aba
└── static/
    ├── js/
    │   └── tupana.js          # Lógica JavaScript
    └── css/
        └── tupana.css         # Estilos CSS
```

## Uso

Após a instalação:

1. Reinicie o OctoPrint
2. Você verá a nova aba "Cores" ao lado de Control e Temperature
3. Selecione suas cores favoritas
4. Clique em "Salvar Cores" para persistir suas escolhas
5. Use "Resetar" para voltar às cores padrão

## Desenvolvimento

Para desenvolver este plugin:

1. Clone o repositório
2. Faça suas modificações
3. Teste instalando localmente
4. Submeta um pull request

## Licença

AGPLv3

## Autor

Seu Nome - seuemail@exemplo.com
