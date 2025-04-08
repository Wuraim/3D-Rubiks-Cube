FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Commande Nginx par défaut
CMD ["nginx", "-g", "daemon off;"]
