# 🚀 Deploy via GitHub → Docker Hub → Portainer

Fluxo automático de deploy usando GitHub Actions

---

## 📋 Fluxo Completo (3 Passos)

```
1. Git Push → GitHub
         ↓
2. GitHub Actions → Build → Docker Hub
         ↓
3. Portainer → Deploy Stack
```

---

## 🔧 Passo 1: Configurar GitHub Actions

### 1.1 Configurar Secrets no GitHub

Acesse: `Repositório → Settings → Secrets and variables → Actions`

Criar os seguintes secrets:

| Nome | Valor | Descrição |
|------|-------|-----------|
| `DOCKERHUB_USERNAME` | `123atendi` | Usuário Docker Hub |
| `DOCKERHUB_TOKEN` | `[seu token]` | Token de acesso Docker Hub |

**Como criar token Docker Hub:**
1. Acessar: https://hub.docker.com/settings/security
2. New Access Token
3. Description: `GitHub Actions`
4. Permissions: `Read & Write`
5. Copiar o token gerado

---

## 🔧 Passo 2: Fazer Commit e Push

### 2.1 Preparar código

```bash
cd anna-confirma-consulta

# Ver arquivos modificados
git status

# Adicionar todos os arquivos
git add .

# Commit
git commit -m "feat: configuração inicial para deploy"

# Push para GitHub
git push origin main
```

### 2.2 Verificar GitHub Actions

1. Acessar: `Repositório → Actions`
2. Ver workflow rodando: "Build and Push Docker Image"
3. Aguardar conclusão (~3-5 minutos)
4. Verificar se apareceu ✅ verde

**O que o GitHub Actions faz:**
- ✅ Build da imagem Docker
- ✅ Push para Docker Hub (123atendi/anna-confirma-consulta:latest)
- ✅ Cache para builds futuros serem mais rápidos

---

## 🔧 Passo 3: Deploy no Portainer

### 3.1 Acessar Portainer

```
URL: https://portainer.seu-servidor.com
```

### 3.2 Criar Stack

1. **Menu lateral:** Stacks
2. **Botão:** Add stack
3. **Name:** `confirma`
4. **Build method:** Web editor

### 3.3 Colar stack.yaml

Cole o seguinte conteúdo:

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

### 3.4 Deploy

1. **Botão:** Deploy the stack
2. Aguardar alguns segundos
3. Ver status: **✅ 1/1 running**

---

## 🔄 Atualizações Futuras

### Quando fizer mudanças no código:

```bash
# 1. Fazer commit
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# 2. GitHub Actions faz build automático
# (aguardar ~3-5 minutos)

# 3. Atualizar no Portainer
```

### Opção A: Atualizar via Portainer (Recomendado)

1. **Portainer → Stacks → confirma**
2. **Botão:** Update the stack
3. **Checkbox:** ✅ Re-pull image and redeploy
4. **Botão:** Update

### Opção B: Atualizar via SSH

```bash
ssh usuario@servidor
docker service update --image 123atendi/anna-confirma-consulta:latest confirma_confirma-consulta --force
```

---

## 🎯 Fluxo Visual Completo

### Deploy Inicial

```
┌─────────────────────┐
│  1. Código Local    │
│  git push origin    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  2. GitHub Actions  │
│  • Build imagem     │
│  • Push Docker Hub  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  3. Docker Hub      │
│  Imagem disponível  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  4. Portainer       │
│  Deploy stack       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  5. Servidor        │
│  App rodando! 🚀    │
└─────────────────────┘
```

### Atualizações

```
┌─────────────────────┐
│  1. git push        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  2. GitHub Actions  │
│  Build automático   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  3. Portainer       │
│  Update stack       │
│  (Re-pull image)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  4. App atualizada! │
└─────────────────────┘
```

---

## ✅ Checklist Completo

### Primeira vez

- [ ] Criar repositório no GitHub
- [ ] Configurar secrets (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN)
- [ ] Fazer primeiro commit e push
- [ ] Verificar GitHub Actions rodou ✅
- [ ] Verificar imagem apareceu no Docker Hub
- [ ] Criar stack no Portainer
- [ ] Verificar app rodando: https://confirma.123atendi.com.br

### Atualizações

- [ ] Fazer commit das mudanças
- [ ] Push para GitHub
- [ ] Aguardar GitHub Actions ✅
- [ ] Atualizar stack no Portainer
- [ ] Testar app atualizada

---

## 🐛 Troubleshooting

### GitHub Actions falhou

**Ver logs:**
1. GitHub → Actions → Click no workflow com ❌
2. Ver qual step falhou
3. Ver logs detalhados

**Erros comuns:**
- **Login failed:** Verificar DOCKERHUB_TOKEN
- **Build failed:** Ver logs de build, pode ser erro no Dockerfile
- **Push failed:** Verificar permissões do token

### Imagem não atualiza no Portainer

**Forçar atualização:**
1. Portainer → Stacks → confirma
2. ✅ Re-pull image and redeploy
3. Update

**Ou via SSH:**
```bash
docker service update --image 123atendi/anna-confirma-consulta:latest confirma_confirma-consulta --force
```

### App não carrega depois do deploy

**Verificar logs:**
1. Portainer → Containers → click no container
2. Logs tab
3. Procurar por erros

**Ou via SSH:**
```bash
docker service logs confirma_confirma-consulta --tail 100
```

---

## 📊 Verificações de Deploy

### 1. Verificar GitHub Actions

```
✅ Build concluído
✅ Push para Docker Hub
✅ Sem erros
```

### 2. Verificar Docker Hub

Acessar: https://hub.docker.com/r/123atendi/anna-confirma-consulta/tags

```
✅ Tag 'latest' atualizada
✅ Timestamp recente
```

### 3. Verificar Portainer

```
✅ Stack 'confirma' running
✅ 1/1 replicas
✅ Status: Running
```

### 4. Verificar App

```
✅ https://confirma.123atendi.com.br carrega
✅ HTTPS funcionando
✅ Testar com token válido
```

---

## 🎓 Comandos Úteis

### Ver logs no Portainer

1. Stacks → confirma
2. Container → Logs

### Ver logs via SSH

```bash
# Logs do serviço
docker service logs confirma_confirma-consulta --tail 50 -f

# Status do serviço
docker service ps confirma_confirma-consulta

# Listar serviços
docker service ls | grep confirma
```

### Forçar re-deploy

```bash
# Via SSH
docker service update --force confirma_confirma-consulta
```

---

## 💡 Dicas

1. **Sempre verificar GitHub Actions antes de atualizar Portainer**
   - Se Actions falhou, não vai ter imagem nova

2. **Use tags versionadas para produção crítica**
   ```yaml
   image: 123atendi/anna-confirma-consulta:v1.0.0
   ```

3. **Mantenha changelog de mudanças**
   - Facilita rollback se necessário

4. **Teste localmente antes de fazer push**
   ```bash
   npm run build
   docker-compose up
   ```

---

## 🔄 Rollback

Se deploy der problema:

### Via Portainer

1. Stacks → confirma → Editor
2. Mudar tag da imagem:
   ```yaml
   image: 123atendi/anna-confirma-consulta:v1.0.0  # versão anterior
   ```
3. Update stack

### Via SSH

```bash
docker service update --image 123atendi/anna-confirma-consulta:v1.0.0 confirma_confirma-consulta
```

---

**Última atualização:** Janeiro 2026
**Versão:** 1.0
**Fluxo:** GitHub → Docker Hub → Portainer
