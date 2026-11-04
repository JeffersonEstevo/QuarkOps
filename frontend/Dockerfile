# frontend/Dockerfile
# Stage 1: Build (Node)
FROM node:20-alpine AS builder

WORKDIR /app

# ARGs para injeção de env vars no build (Vite só lê env vars em build time)
ARG VITE_API_ADAPTER=http
ARG VITE_API_URL=/api
ENV VITE_API_ADAPTER=$VITE_API_ADAPTER
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve (Nginx)
FROM nginx:1.27-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copia config customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build estático do stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]