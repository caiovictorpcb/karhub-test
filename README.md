# API de Recomendação de Cervejas

API RESTful em NestJS para gerenciar estilos de cerveja e recomendar cervejas com playlists do Spotify.

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando a Aplicação](#executando-a-aplicação)
- [Testes](#testes)
- [Linting e Formatação](#linting-e-formatação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints da API](#endpoints-da-api)
- [Banco de Dados](#banco-de-dados)
- [Variáveis de Ambiente](#variáveis-de-ambiente)

## Pré-requisitos

- Node.js (v20.x ou superior)
- npm (v10.x ou superior)
- MongoDB (v6.x ou superior, rodando localmente ou acessível via string de conexão)
- Conta de Desenvolvedor Spotify (para credenciais da API)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/caiovictorpcb/karhub-test.git
   cd karhub-test
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Configuração

1. Crie um arquivo `.env` na raiz do projeto. Os valores das variáveis de ambiente serão fornecidos no e-mail contendo o link do repositório.

2. Certifique-se de que o MongoDB está rodando e acessível na `MONGODB_URL` fornecida.

3. As credenciais da API do Spotify (`SPOTIFY_CLIENT_ID` e `SPOTIFY_CLIENT_SECRET`) também estarão no e-mail.

## Executando a Aplicação

- **Modo Desenvolvimento** (com hot-reload):
  ```bash
  npm run start:dev
  ```

- **Buildar a Aplicação**:
  ```bash
  npm run build
  ```

- **Modo Produção**:
  ```bash
  npm run start:prod
  ```

A API estará disponível em `http://localhost:3000` (ou na porta especificada no `.env`).

## Testes

- **Executar Testes**:
  ```bash
  npm run test
  ```

- **Modo Watch** (reexecuta testes ao alterar arquivos):
  ```bash
  npm run test:watch
  ```

- **Relatório de Cobertura**:
  ```bash
  npm run test:cov
  ```

## Estrutura do Projeto

```
├── src
│   ├── beer
│   │   ├── dto
│   │   ├── schemas
│   │   ├── beer.controller.ts
│   │   ├── beer.service.ts
│   │   ├── beer.module.ts
│   ├── spotify
│   │   ├── spotify.service.ts
│   │   ├── spotify.module.ts
│   ├── config
│   │   ├── mongoose.config.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   ├── main.ts
├── .env
├── package.json
├── tsconfig.json
├── README.md
```

## Endpoints da API

- **POST** `/beer`: Cria um estilo de cerveja.
- **GET** `/beer`: Lista todos os estilos de cerveja.
- **POST** `/beer/recommend`: Recomenda um estilo de cerveja e playlist com base na temperatura.
- **PATCH** `/beer/:beerStyle`: Atualiza um estilo de cerveja.
- **DELETE** `/beer/:beerStyle`: Deleta um estilo de cerveja.

Consulte o `BeerController` para formatos detalhados de requisição/resposta.

## Banco de Dados

- **MongoDB**: Utiliza Mongoose para gerenciamento de esquemas.
- **Coleção**: `beers` (definida no `BeerSchema`).
- **Esquema**: Inclui `beerStyle`, `minTemperature`, `maxTemperature`, `averageTemperature`, `deleted` e timestamps.
- **Soft Delete**: Consultas excluem documentos com `deleted: true`.

## Variáveis de Ambiente

| Variável                 | Descrição                           |
|--------------------------|-------------------------------------|
| `MONGODB_URL`              | String de conexão com MongoDB       |
| `SPOTIFY_CLIENT_ID`      | Client ID da API do Spotify         |
| `SPOTIFY_CLIENT_SECRET`  | Client Secret da API do Spotify     |
| `PORT`                   | Porta da API                        |

Os valores serão fornecidos no e-mail com o link do repositório.
