# Guia de Instalação Rápida

## 🚀 Instalação em 5 minutos

### 1. Pré-requisitos
- Go 1.21+ instalado
- Node.js 16+ instalado
- npm ou yarn instalado

### 2. Backend (Go)
```bash
cd recruitment-system/backend
go mod tidy
go run .
```
✅ Backend rodando em http://localhost:8080

### 3. Frontend (React)
```bash
cd recruitment-system/frontend
npm install
npm run dev
```
✅ Frontend rodando em http://localhost:5173

### 4. Acesse o Sistema
- Abra http://localhost:5173 no navegador
- Crie uma conta ou faça login
- Comece a usar o sistema!

## 📱 Funcionalidades Disponíveis

- ✅ **Cadastro e Login** com email/senha
- ✅ **Criar Vagas** com título, empresa, localização
- ✅ **Buscar Vagas** com filtros e busca
- ✅ **Candidatar-se** para vagas
- ✅ **Dashboard** com resumo das atividades
- ✅ **Gerenciar Candidaturas** (status, cancelar)

## 🔧 Solução de Problemas

### Backend não inicia
```bash
cd backend
go mod download
go run .
```

### Frontend não inicia
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Banco de dados
- O SQLite é criado automaticamente
- Arquivo: `backend/recruitment.db`

## 🌐 URLs Importantes

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Login**: http://localhost:5173/login
- **Registro**: http://localhost:5173/register

## 📝 Primeiro Uso

1. Acesse http://localhost:5173
2. Clique em "Registre-se"
3. Preencha nome, email e senha
4. Faça login
5. Crie sua primeira vaga ou candidate-se para uma existente

## 🎯 Teste Rápido

1. **Criar conta**: Registre-se com seus dados
2. **Criar vaga**: Clique em "Criar Nova Vaga"
3. **Candidatar-se**: Veja vagas disponíveis e candidate-se
4. **Dashboard**: Visualize suas vagas e candidaturas

## 🆘 Suporte

Se encontrar problemas:
1. Verifique se Go e Node.js estão instalados
2. Confirme se as portas 8080 e 5173 estão livres
3. Verifique os logs no terminal
4. Reinicie os servidores se necessário

---

**🎉 Pronto! Seu sistema de recrutamento está funcionando!**
