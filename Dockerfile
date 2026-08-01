# Estágio 1: Build do Frontend e Servidor
FROM node:18-alpine AS builder

WORKDIR /app

# Copia gerenciador de pacotes
COPY package*.json ./

# Instala todas as dependências para compilação
RUN npm install

# Copia o código fonte do projeto
COPY . .

# Compila o frontend React com o Vite (gera pasta dist/)
RUN npm run build

# Estágio 2: Ambiente de Execução em Produção
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copia arquivos de dependências e instala apenas dependências de produção
COPY package*.json ./
RUN npm install --only=production

# Copia o build estático e os arquivos do servidor Express
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

EXPOSE 3000

# Comando para iniciar o servidor API + Frontend
CMD ["node", "server/index.js"]
