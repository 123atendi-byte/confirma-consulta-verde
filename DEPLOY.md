# 🚀 Deploy - Anna Confirmação de Consultas

Guia completo de build e deploy da aplicação

---

## 📋 Pré-requisitos

- Docker instalado
- Docker Hub account (123atendi)
- Acesso ao servidor Docker Swarm
- Git configurado

---

## 🔧 Processo Completo de Deploy

### 1️⃣ Preparar o Código

```bash
# Garantir que está na branch correta
cd anna-confirma-consulta
git status

# Atualizar dependências se necessário
npm install

# Testar build local
npm run build

# Verificar se o build funcionou
ls -la dist/
```

---

### 2️⃣ Fazer Build da Imagem Docker

```bash
# Build da imagem com tag latest
docker build -t 123atendi/anna-confirma-consulta:latest .

# Build com tag de versão específica (recomendado)
docker build -t 123atendi/anna-confirma-consulta:v1.0.0 .

# Build com ambas as tags
docker build -t 123atendi/anna-confirma-consulta:latest \
             -t 123atendi/anna-confirma-consulta:v1.0.0 .
```

**Tempo estimado:** 2-3 minutos

---

### 3️⃣ Testar Localmente (IMPORTANTE!)

```bash
# Testar com docker-compose
docker-compose up

# Ou testar direto
docker run -d -p 8080:80 123atendi/anna-confirma-consulta:latest

# Acessar: http://localhost:8080
# Testar com um token válido: http://localhost:8080/?token={UUID}

# Parar containers de teste
docker-compose down
# ou
docker stop <container_id>
```

---

### 4️⃣ Fazer Login no Docker Hub

```bash
# Login no Docker Hub
docker login

# Usar credenciais:
# Username: 123atendi
# Password: [senha do Docker Hub]
```

---

### 5️⃣ Push para Docker Hub

```bash
# Push da imagem latest
docker push 123atendi/anna-confirma-consulta:latest

# Push da versão específica (se criou)
docker push 123atendi/anna-confirma-consulta:v1.0.0
```

**Tempo estimado:** 1-2 minutos (depende da conexão)

---

### 6️⃣ Deploy no Docker Swarm

#### Opção A: Deploy pela primeira vez

```bash
# Conectar ao servidor Swarm (SSH)
ssh usuario@seu-servidor.com

# Criar o arquivo stack.yaml no servidor
nano stack.yaml
# (colar o conteúdo do stack.yaml)

# Deploy da stack
docker stack deploy -c stack.yaml confirma

# Verificar deploy
docker service ls | grep confirma
docker service logs confirma_confirma-consulta
```

#### Opção B: Atualizar serviço existente

```bash
# Conectar ao servidor
ssh usuario@seu-servidor.com

# Forçar atualização da imagem
docker service update --image 123atendi/anna-confirma-consulta:latest confirma_confirma-consulta

# Ou remover e redeployar
docker stack rm confirma
# Aguardar 30 segundos
docker stack deploy -c stack.yaml confirma
```

---

### 7️⃣ Verificar Deploy

```bash
# Ver status dos serviços
docker service ls

# Ver logs em tempo real
docker service logs -f confirma_confirma-consulta

# Ver containers rodando
docker ps | grep confirma

# Ver detalhes do serviço
docker service ps confirma_confirma-consulta
```

**Verificar no navegador:**
- https://confirma.123atendi.com.br
- Testar com token válido

---

## 🔄 Fluxo Resumido (Checklist)

```bash
# Local
[ ] cd anna-confirma-consulta
[ ] git pull origin main
[ ] npm install
[ ] npm run build
[ ] docker build -t 123atendi/anna-confirma-consulta:latest .
[ ] docker-compose up (testar)
[ ] docker login
[ ] docker push 123atendi/anna-confirma-consulta:latest

# Servidor
[ ] ssh usuario@servidor
[ ] docker service update --image 123atendi/anna-confirma-consulta:latest confirma_confirma-consulta
[ ] docker service logs confirma_confirma-consulta
[ ] Testar: https://confirma.123atendi.com.br
```

---

## 📦 Estrutura dos Arquivos Docker

```
anna-confirma-consulta/
├── Dockerfile              ← Instruções de build
├── nginx.conf              ← Config do Nginx
├── .dockerignore           ← Arquivos ignorados no build
├── docker-compose.yml      ← Testes locais
└── stack.yaml              ← Deploy production (Swarm)
```

---

## 🐛 Troubleshooting

### Build falha

```bash
# Limpar cache do Docker
docker builder prune -a

# Build sem cache
docker build --no-cache -t 123atendi/anna-confirma-consulta:latest .
```

### Push falha (não autenticado)

```bash
# Fazer logout e login novamente
docker logout
docker login
```

### Serviço não inicia

```bash
# Ver logs detalhados
docker service logs confirma_confirma-consulta --raw

# Ver tasks do serviço
docker service ps confirma_confirma-consulta --no-trunc

# Inspecionar serviço
docker service inspect confirma_confirma-consulta
```

### Erro 502 no navegador

1. Verificar se container está rodando: `docker ps`
2. Ver logs: `docker service logs confirma_confirma-consulta`
3. Verificar Traefik: `docker service logs traefik`
4. Verificar DNS: `nslookup confirma.123atendi.com.br`

### Aplicação não carrega token

1. Verificar webhooks n8n estão ativos
2. Testar chamada manual:
   ```bash
   curl -u "123confirmei:UqHFQQ8HHjLc" \
        "https://webhook.123atendi.com.br/webhook/api/confirmacao123?token=SEU_TOKEN"
   ```

---

## 🔐 Variáveis de Ambiente (Futuro)

Atualmente as credenciais estão hardcoded em `src/services/api.ts`.

**Para usar variáveis de ambiente:**

1. Criar arquivo `.env` (não comitar!)
   ```env
   VITE_API_USERNAME=123confirmei
   VITE_API_PASSWORD=UqHFQQ8HHjLc
   VITE_API_URL=https://webhook.123atendi.com.br/webhook/api
   ```

2. Atualizar código para usar:
   ```typescript
   const API_CONFIG = {
     username: import.meta.env.VITE_API_USERNAME,
     password: import.meta.env.VITE_API_PASSWORD,
   };
   ```

3. Build com variáveis:
   ```bash
   docker build \
     --build-arg VITE_API_USERNAME=123confirmei \
     --build-arg VITE_API_PASSWORD=UqHFQQ8HHjLc \
     -t 123atendi/anna-confirma-consulta:latest .
   ```

---

## 📊 Monitoramento

### Métricas Úteis

```bash
# CPU/Memory do serviço
docker stats $(docker ps -q -f name=confirma)

# Número de replicas
docker service scale confirma_confirma-consulta=2

# Rollback para versão anterior
docker service rollback confirma_confirma-consulta
```

### Logs

```bash
# Últimas 100 linhas
docker service logs --tail 100 confirma_confirma-consulta

# Seguir logs em tempo real
docker service logs -f confirma_confirma-consulta

# Logs com timestamp
docker service logs -t confirma_confirma-consulta
```

---

## 🔄 Rollback

Se o deploy der problema:

```bash
# Opção 1: Rollback automático
docker service rollback confirma_confirma-consulta

# Opção 2: Deploy versão anterior manual
docker service update --image 123atendi/anna-confirma-consulta:v0.9.0 confirma_confirma-consulta

# Opção 3: Remover e redeployar versão antiga
docker stack rm confirma
docker stack deploy -c stack-v0.9.0.yaml anna
```

---

## 📝 Versionamento

### Nomenclatura de Versões

```bash
# Desenvolvimento
123atendi/anna-confirma-consulta:dev

# Versão específica
123atendi/anna-confirma-consulta:v1.0.0
123atendi/anna-confirma-consulta:v1.1.0

# Produção (sempre aponta para última estável)
123atendi/anna-confirma-consulta:latest
```

### Criar Nova Versão

```bash
# Build com múltiplas tags
docker build \
  -t 123atendi/anna-confirma-consulta:latest \
  -t 123atendi/anna-confirma-consulta:v1.1.0 \
  .

# Push de todas as tags
docker push 123atendi/anna-confirma-consulta:latest
docker push 123atendi/anna-confirma-consulta:v1.1.0
```

---

## 🎯 Checklist de Produção

Antes de fazer deploy em produção:

- [ ] Código testado localmente (`npm run dev`)
- [ ] Build testado localmente (`npm run build`)
- [ ] Docker image buildada
- [ ] Container testado localmente (`docker-compose up`)
- [ ] Funcionalidade testada com token válido
- [ ] Webhooks n8n funcionando
- [ ] Imagem enviada para Docker Hub
- [ ] Deploy feito no Swarm
- [ ] Logs verificados (sem erros)
- [ ] Site acessível (https://confirma.123atendi.com.br)
- [ ] SSL funcionando (HTTPS)
- [ ] Teste end-to-end com token real

---

## 📞 Comandos Rápidos

```bash
# Build + Push + Deploy (ATENÇÃO: usar com cuidado!)
docker build -t 123atendi/anna-confirma-consulta:latest . && \
docker push 123atendi/anna-confirma-consulta:latest && \
ssh usuario@servidor 'docker service update --image 123atendi/anna-confirma-consulta:latest confirma_confirma-consulta'

# Ver tudo relacionado a Anna no Swarm
docker service ls | grep confirma
docker ps | grep confirma
docker service logs confirma_confirma-consulta --tail 50
```

---

**Última atualização:** Janeiro 2026
**Versão:** 1.0
**Responsável:** 123Atendi
