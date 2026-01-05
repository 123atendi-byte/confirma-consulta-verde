2# ⚡ Deploy Rápido - Anna

Guia visual passo-a-passo (cole e execute)

---

## 🎯 Passo 1: Build da Imagem

```bash
cd anna-confirma-consulta
docker build -t 123atendi/anna-confirma-consulta:latest .
```

**Resultado esperado:**
```
Successfully built abc123def456
Successfully tagged 123atendi/anna-confirma-consulta:latest
```

---

## 🎯 Passo 2: Testar Localmente

```bash
docker-compose up
```

**Acessar no navegador:**
- http://localhost:8080

**Resultado esperado:**
- Página do Anna carrega
- Mostra "Link inválido. Token não encontrado." (normal)

**Para parar:**
```bash
# Ctrl+C
docker-compose down
```

---

## 🎯 Passo 3: Login Docker Hub

```bash
docker login
```

**Credenciais:**
- Username: `123atendi`
- Password: `[sua senha do Docker Hub]`

**Resultado esperado:**
```
Login Succeeded
```

---

## 🎯 Passo 4: Push para Docker Hub

```bash
docker push 123atendi/anna-confirma-consulta:latest
```

**Resultado esperado:**
```
The push refers to repository [docker.io/123atendi/anna-confirma-consulta]
abc123: Pushed
def456: Pushed
latest: digest: sha256:xxxxx size: 1234
```

---

## 🎯 Passo 5: Conectar ao Servidor

```bash
ssh usuario@seu-servidor.com
```

---

## 🎯 Passo 6: Deploy no Swarm

### Opção A: Primeira vez (criar stack.yaml no servidor)

```bash
# No servidor
cat > stack.yaml << 'EOF'
version: "3.8"

services:
  confirma-consulta:
    image: 123atendi/anna-confirma-consulta:latest
    networks:
      - externa
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      labels:
        traefik.enable: "true"
        traefik.http.routers.confirma.rule: "Host(\`confirma.123atendi.com.br\`)"
        traefik.http.routers.confirma.entrypoints: "websecure"
        traefik.http.routers.confirma.priority: "1"
        traefik.http.routers.confirma.tls.certresolver: "cf"
        traefik.http.routers.confirma.service: "confirma"
        traefik.http.services.confirma.loadbalancer.server.port: "80"
        traefik.http.services.confirma.loadbalancer.passHostHeader: "true"

networks:
  externa:
    external: true
EOF

# Deploy
docker stack deploy -c stack.yaml confirma
```

### Opção B: Atualizar existente

```bash
docker service update --image 123atendi/anna-confirma-consulta:latest confirma_confirma-consulta
```

---

## 🎯 Passo 7: Verificar Deploy

```bash
# Ver serviços
docker service ls | grep confirma

# Ver logs
docker service logs confirma_confirma-consulta --tail 50

# Seguir logs em tempo real
docker service logs -f confirma_confirma-consulta
```

**Resultado esperado:**
```
ID             NAME                          MODE         REPLICAS   IMAGE
abc123def456   confirma_confirma-consulta   replicated   1/1        123atendi/anna-confirma-consulta:latest
```

---

## 🎯 Passo 8: Testar no Navegador

**Acessar:**
- https://confirma.123atendi.com.br

**Testar com token:**
- https://confirma.123atendi.com.br/?token=SEU_TOKEN_VALIDO

**Resultado esperado:**
- ✅ HTTPS funcionando (cadeado verde)
- ✅ Página carrega
- ✅ Com token válido, mostra dados da consulta

---

## 🔥 Comando Único (Build → Push → Deploy)

```bash
# Local
cd anna-confirma-consulta && \
docker build -t 123atendi/anna-confirma-consulta:latest . && \
docker push 123atendi/anna-confirma-consulta:latest

# Servidor (SSH separado)
docker service update --image 123atendi/anna-confirma-consulta:latest confirma_confirma-consulta
```

---

## 🐛 Troubleshooting Rápido

### Build falha

```bash
docker builder prune -a
docker build --no-cache -t 123atendi/anna-confirma-consulta:latest .
```

### Push falha

```bash
docker logout
docker login
docker push 123atendi/anna-confirma-consulta:latest
```

### Serviço não inicia

```bash
docker service ps confirma_confirma-consulta --no-trunc
docker service logs confirma_confirma-consulta --raw
```

### Erro 502

```bash
# Verificar se container está rodando
docker ps | grep confirma

# Ver logs
docker service logs confirma_confirma-consulta
```

---

## 📝 Notas Importantes

1. **Build leva ~2-3 minutos**
2. **Push leva ~1-2 minutos** (depende da internet)
3. **Deploy é quase instantâneo**
4. **Aguardar 10-30 segundos** após deploy para DNS propagar

---

## ✅ Checklist Visual

```
[ ] cd anna-confirma-consulta
[ ] docker build ✓
[ ] docker-compose up (testar)
[ ] docker-compose down
[ ] docker login
[ ] docker push ✓
[ ] ssh servidor
[ ] docker stack deploy ✓
[ ] docker service logs (verificar)
[ ] https://confirma.123atendi.com.br (testar)
```

---

**💡 Dica:** Salve este arquivo como favorito para consultas rápidas!
