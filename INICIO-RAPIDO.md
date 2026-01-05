# ⚡ Início Rápido - Deploy Completo

Guia super rápido para fazer o primeiro deploy

---

## 🎯 Passo a Passo (3 Minutos)

### 1️⃣ Configurar GitHub (Uma vez só)

**Criar secrets:**
- Ir em: `Repositório → Settings → Secrets → Actions`
- Adicionar:
  - `DOCKERHUB_USERNAME` = `123atendi`
  - `DOCKERHUB_TOKEN` = `[token do Docker Hub]`

**Como pegar token Docker Hub:**
https://hub.docker.com/settings/security → New Access Token

---

### 2️⃣ Fazer Push para GitHub

```bash
cd anna-confirma-consulta

git add .
git commit -m "feat: deploy inicial"
git push origin main
```

**Aguardar 3-5 minutos** para GitHub Actions fazer o build

---

### 3️⃣ Deploy no Portainer

**Acessar Portainer:**
```
Stacks → Add stack → Name: confirma
```

**Colar este YAML:**

```yaml
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
        traefik.http.routers.confirma.rule: "Host(`confirma.123atendi.com.br`)"
        traefik.http.routers.confirma.entrypoints: "websecure"
        traefik.http.routers.confirma.priority: "1"
        traefik.http.routers.confirma.tls.certresolver: "cf"
        traefik.http.routers.confirma.service: "confirma"
        traefik.http.services.confirma.loadbalancer.server.port: "80"
        traefik.http.services.confirma.loadbalancer.passHostHeader: "true"

networks:
  externa:
    external: true
```

**Clicar:** Deploy the stack

---

### 4️⃣ Testar

Acessar: https://confirma.123atendi.com.br

✅ Pronto!

---

## 🔄 Atualizações (30 segundos)

```bash
# 1. Fazer mudanças no código
# 2. Commit e push
git add .
git commit -m "fix: correção"
git push origin main

# 3. Aguardar GitHub Actions (~3min)

# 4. Atualizar Portainer:
# Stacks → confirma → Update → ✅ Re-pull image → Update
```

---

## 📚 Documentação Completa

- **Deploy GitHub:** [DEPLOY-GITHUB.md](DEPLOY-GITHUB.md)
- **Deploy Manual:** [DEPLOY.md](DEPLOY.md)
- **Deploy Rápido:** [DEPLOY-RAPIDO.md](DEPLOY-RAPIDO.md)

---

**Fluxo:** Git Push → GitHub Actions → Docker Hub → Portainer
