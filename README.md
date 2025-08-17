# Sistema de Recrutamento e Seleção

Este é um sistema completo de Recrutamento e Seleção com backend em Go (Gin) e frontend em React + Vite.

## Funcionalidades

- ✅ **Autenticação**: Login e registro de usuários
- ✅ **Gestão de Vagas**: Criar, editar, excluir e buscar vagas
- ✅ **Candidaturas**: Candidatar-se para vagas e gerenciar status
- ✅ **Dashboard**: Visão geral das vagas e candidaturas
- ✅ **Proteção de Rotas**: Usuários logados não podem acessar login/registro
- ✅ **Persistência de Login**: Token JWT salvo no localStorage
- ✅ **Interface Responsiva**: Design moderno e responsivo

## Estrutura do Projeto

```
recruitment-system/
├── backend/                 # Backend em Go
│   ├── main.go             # Arquivo principal
│   ├── models.go           # Modelos de dados
│   ├── database.go         # Configuração do banco
│   ├── auth.go             # Handlers de autenticação
│   ├── jobs.go             # Handlers de vagas
│   ├── applications.go     # Handlers de candidaturas
│   ├── profile.go          # Handlers de perfil
│   ├── go.mod              # Dependências Go
│   └── go.sum              # Checksums das dependências
├── frontend/               # Frontend em React + Vite
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── contexts/       # Contextos React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── types/          # Tipos TypeScript
│   │   ├── utils/          # Utilitários
│   │   ├── App.tsx         # Componente principal
│   │   └── main.tsx        # Ponto de entrada
│   ├── package.json        # Dependências Node.js
│   ├── vite.config.ts      # Configuração do Vite
│   └── tsconfig.json       # Configuração TypeScript
└── README.md               # Este arquivo
```

## Tecnologias Utilizadas

### Backend
- **Go 1.21+**: Linguagem principal
- **Gin**: Framework web
- **SQLite**: Banco de dados
- **JWT**: Autenticação
- **bcrypt**: Hash de senhas
- **CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: Biblioteca de UI
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **React Router**: Roteamento
- **Axios**: Cliente HTTP
- **CSS**: Estilos customizados

## Como Executar

### Pré-requisitos
- Go 1.21 ou superior
- Node.js 16 ou superior
- npm ou yarn

### Backend

1. Navegue para o diretório backend:
```bash
cd recruitment-system/backend
```

2. Instale as dependências:
```bash
go mod tidy
```

3. Execute o servidor:
```bash
go run .
```

O backend estará rodando em `http://localhost:8080`

### Frontend

1. Navegue para o diretório frontend:
```bash
cd recruitment-system/frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## API Endpoints

### Autenticação
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Fazer login

### Vagas (Protegidas)
- `GET /api/jobs` - Listar todas as vagas
- `POST /api/jobs` - Criar nova vaga
- `GET /api/jobs/:id` - Buscar vaga específica
- `PUT /api/jobs/:id` - Atualizar vaga
- `DELETE /api/jobs/:id` - Excluir vaga

### Candidaturas (Protegidas)
- `GET /api/applications` - Listar candidaturas do usuário
- `POST /api/applications` - Criar candidatura
- `GET /api/applications/:id` - Buscar candidatura específica
- `PUT /api/applications/:id` - Atualizar status da candidatura
- `DELETE /api/applications/:id` - Cancelar candidatura

### Perfil (Protegidas)
- `GET /api/profile` - Buscar perfil do usuário
- `PUT /api/profile` - Atualizar perfil

## Funcionalidades Principais

### 1. Autenticação
- Registro com nome, email e senha
- Login com email e senha
- Tokens JWT para sessão
- Senhas criptografadas com bcrypt

### 2. Gestão de Vagas
- Criar vagas com título, descrição, empresa, localização, salário e tipo
- Editar vagas existentes
- Excluir vagas
- Busca e filtros por tipo de contrato

### 3. Candidaturas
- Candidatar-se para vagas
- Visualizar status das candidaturas
- Atualizar status (pendente, aceita, rejeitada)
- Cancelar candidaturas

### 4. Dashboard
- Visão geral das vagas criadas
- Resumo das candidaturas
- Navegação rápida para funcionalidades

### 5. Segurança
- Rotas protegidas com middleware JWT
- Validação de dados no backend
- CORS configurado para desenvolvimento
- Usuários só podem editar/excluir suas próprias vagas

## Banco de Dados

O sistema usa SQLite com as seguintes tabelas:

- **users**: Informações dos usuários
- **jobs**: Vagas disponíveis
- **applications**: Candidaturas dos usuários

## Desenvolvimento

### Estrutura de Componentes
- **AuthContext**: Gerencia estado de autenticação
- **Navbar**: Navegação principal
- **LoadingSpinner**: Indicador de carregamento
- **Páginas**: Login, Registro, Dashboard, Vagas, Candidaturas, Criar Vaga

### Estado da Aplicação
- Context API para autenticação
- Estado local para formulários e listas
- Interceptors Axios para tokens e erros

### Estilos
- CSS customizado com classes utilitárias
- Design responsivo
- Componentes com estilos consistentes

## Deploy

### Backend
- Compilar: `go build -o main .`
- Executar: `./main`

### Frontend
- Build: `npm run build`
- Servir arquivos estáticos da pasta `dist`

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.
