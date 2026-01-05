# 🔄 Atualizar Projeto Existente

Guia para atualizar o projeto que já está no GitHub

---

## ✅ Situação Atual

- ✅ Repositório já existe no GitHub
- ✅ Secrets já configurados (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN)
- ⚠️ Código desatualizado

---

## 🚀 Passo a Passo para Atualizar

### 1️⃣ Verificar branch atual

```bash
cd anna-confirma-consulta
git status
git branch
```

**Se não estiver na main/master:**
```bash
git checkout main
# ou
git checkout master
```

### 2️⃣ Sincronizar com GitHub (pegar versão atual)

```bash
# Puxar últimas mudanças do GitHub
git pull origin main
```

**Se der conflito:**
```bash
# Ver quais arquivos têm conflito
git status

# Opção A: Manter sua versão local (sobrescrever GitHub)
git add .
git commit -m "fix: atualização local"
git push origin main --force

# Opção B: Resolver conflitos manualmente
# (editar arquivos conflitantes)
git add .
git commit -m "fix: merge conflicts"
git push origin main
```

### 3️⃣ Adicionar todos os novos arquivos

```bash
# Ver o que mudou
git status

# Adicionar tudo
git add .

# Ver o que será commitado
git status
```

### 4️⃣ Fazer commit

```bash
git commit -m "feat: atualização completa do projeto

- Dockerfile e nginx.conf configurados
- Stack.yaml com domínio confirma.123atendi.com.br
- Documentação completa criada
- GitHub Actions para build automático
- Pronto para deploy
"
```

### 5️⃣ Push para GitHub

```bash
git push origin main
# ou
git push origin master
```

**Se pedir autenticação:**
- Username: seu usuário GitHub
- Password: **Personal Access Token** (não é a senha normal)
  - Criar em: https://github.com/settings/tokens

### 6️⃣ Verificar GitHub Actions

1. Acessar: https://github.com/SEU-USUARIO/NOME-REPO/actions
2. Ver workflow rodando: "Build and Push Docker Image"
3. Aguardar conclusão (~3-5 minutos)
4. Deve aparecer ✅ verde

**O que está acontecendo:**
- 🔨 Build da imagem Docker
- 📦 Push para Docker Hub
- ✅ Imagem disponível em: https://hub.docker.com/r/123atendi/anna-confirma-consulta

### 7️⃣ Atualizar no Portainer

**Opção A: Primeira vez (criar stack nova)**

1. Portainer → Stacks → Add stack
2. Name: `confirma`
3. Web editor → Colar:

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

4. Deploy the stack

**Opção B: Stack já existe (atualizar)**

1. Portainer → Stacks → [sua stack]
2. Editor → Verificar/atualizar configuração
3. ✅ **Re-pull image and redeploy**
4. Update the stack

### 8️⃣ Verificar

```bash
# Ver logs (via SSH no servidor)
docker service logs confirma_confirma-consulta --tail 50

# Ver status
docker service ps confirma_confirma-consulta
```

**No navegador:**
- https://confirma.123atendi.com.br
- Testar com token válido

---

## 📋 Checklist Rápido

```
[ ] cd anna-confirma-consulta
[ ] git pull origin main
[ ] git add .
[ ] git commit -m "feat: atualização completa"
[ ] git push origin main
[ ] Aguardar GitHub Actions ✅ (3-5 min)
[ ] Portainer → Update stack → ✅ Re-pull image
[ ] Testar: https://confirma.123atendi.com.br
```

---

## 🐛 Problemas Comuns

### "fatal: not a git repository"

O projeto não foi inicializado como git:

```bash
cd anna-confirma-consulta
git init
git remote add origin https://github.com/SEU-USUARIO/REPO.git
git add .
git commit -m "feat: projeto inicial"
git push -u origin main
```

### "remote origin already exists"

```bash
# Ver remote atual
git remote -v

# Se estiver errado, atualizar
git remote set-url origin https://github.com/SEU-USUARIO/REPO-CORRETO.git
```

### "failed to push some refs"

Versão local divergiu do GitHub:

```bash
# Opção A: Forçar sua versão (CUIDADO!)
git push origin main --force

# Opção B: Puxar e resolver conflitos
git pull origin main --rebase
# Resolver conflitos se houver
git push origin main
```

### GitHub Actions não rodou

Verificar:
1. Arquivo existe: `.github/workflows/docker-build-push.yml`
2. Push foi na branch `main` ou `master`
3. Ver aba Actions no GitHub

### Imagem não atualizou

Verificar:
1. GitHub Actions terminou com ✅
2. Ver timestamp em: https://hub.docker.com/r/123atendi/anna-confirma-consulta/tags
3. No Portainer: marcar ✅ "Re-pull image"

---

## 🎯 Comandos em Sequência (Copiar e Colar)

```bash
# 1. Entrar na pasta
cd anna-confirma-consulta

# 2. Verificar status
git status

# 3. Puxar atualizações
git pull origin main

# 4. Adicionar mudanças
git add .

# 5. Commit
git commit -m "feat: atualização completa do projeto"

# 6. Push
git push origin main

# 7. Aguardar ~3-5 minutos para build

# 8. Verificar Actions
echo "Acesse: https://github.com/SEU-USUARIO/REPO/actions"

# 9. Quando Actions terminar ✅
echo "Ir no Portainer → Stacks → Update → Re-pull image"
```

---

## 📊 Verificação Final

### ✅ Git

```bash
git log --oneline -5
# Deve mostrar seu último commit no topo
```

### ✅ GitHub Actions

- Workflow com ✅ verde
- Tempo: ~3-5 minutos

### ✅ Docker Hub

- Tag `latest` atualizada
- Timestamp recente

### ✅ Portainer

- Stack `confirma` running
- 1/1 replicas

### ✅ Aplicação

- https://confirma.123atendi.com.br funcionando
- Token válido mostra dados

---

**Próximo passo:** Fazer commit e push! 🚀
