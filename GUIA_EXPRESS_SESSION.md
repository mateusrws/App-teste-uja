# 📚 Guia Completo: express-session com Redis

## 🎯 Objetivo
Aprender a implementar sistema de sessão usando `express-session` + `connect-redis` de forma simples e profissional.

---

## 📦 PASSO 1: Instalar Dependências

Execute no terminal:

```bash
npm install express-session connect-redis
npm install --save-dev @types/express-session
```

**O que cada pacote faz:**
- `express-session`: Middleware de sessão para Express
- `connect-redis`: Store para salvar sessões no Redis
- `@types/express-session`: Tipos TypeScript (já você tem instalado)

---

## 🔧 PASSO 2: Configurar Session no index.ts

**Arquivo:** `src/index.ts`

### O que fazer:

1. **Importar** os módulos necessários:

```typescript
import session from 'express-session';
import RedisStore from 'connect-redis';
import client from './redis';
```

2. **Adicionar** o middleware de sessão **ANTES** das rotas:

```typescript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import RedisStore from 'connect-redis';
import routes from './routes';
import { testConnection } from './prisma';
import { connectRedis } from './redis';
import client from './redis';

dotenv.config();

const app = express();

// IMPORTANTE: Session deve vir ANTES de outras configurações
app.use(session({
  store: new RedisStore({ 
    client: client,
    prefix: "sess:" // Prefixo das chaves no Redis (sess:sessionid)
  }),
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'sua-chave-secreta',
  resave: false, // Não salva sessão se não houve mudanças
  saveUninitialized: false, // Não cria sessão vazia (mais seguro)
  name: 'sessionId', // Nome do cookie (opcional, padrão é 'connect.sid')
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS apenas em produção
    httpOnly: true, // Cookie não acessível via JavaScript (segurança)
    maxAge: 48 * 60 * 60 * 1000, // 48 horas em milissegundos
    sameSite: 'strict' // Proteção contra CSRF
  }
}));

app.use(express.json());
app.use(cors({
  origin: process.env.ENABLED_CORS,
  credentials: true // IMPORTANTE: Permite cookies em CORS
}));

app.use(routes);
```

### ⚠️ Pontos Importantes:

- **`credentials: true`** no CORS é obrigatório para cookies funcionarem
- **`saveUninitialized: false`** evita criar sessões vazias (mais seguro)
- **`resave: false`** evita salvar sessões que não mudaram (melhor performance)

---

## 🔐 PASSO 3: Modificar Controller de Login

**Arquivo:** `src/Controllers/controllerLogin/ControllerLogin.ts`

### O que fazer:

1. **Após validar** a senha e gerar o JWT, **salvar dados na sessão**:

```typescript
import { RequestHandler } from "express";
import prisma from "../../prisma";
import { User } from "../../generated/prisma";
import { compare } from 'bcrypt';
import { JWTService } from "../../services/JWTService";
import { StatusCodes } from "http-status-codes";

export const Login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email ou senha faltando"
      });
    }

    const User: User | null = await prisma.user.findFirst({ where: { email } });

    if (!User) {
      return res.status(400).json({
        message: "Não existe nenhum usuário com este email"
      });
    }

    if (await compare(password, User.password)) {
      const accessToken = JWTService.sign({ uid: User.id });

      if (accessToken == 'JWT_SECRET_NOT_FOUND') {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Erro ao gerar token de acesso'
        });
      }

      // ✨ AQUI: Salvar dados na sessão
      req.session.userId = User.id;
      req.session.email = User.email;
      req.session.loggedIn = true;

      // A sessão é salva automaticamente no Redis pelo express-session
      // O cookie é enviado automaticamente no header Set-Cookie

      return res.status(200).json({
        message: "Login realizado com sucesso",
        accessToken, // Mantém JWT para compatibilidade com mobile/API
        // sessionId está no cookie automaticamente
      });
    } else {
      return res.status(401).json({
        message: "Senha incorreta"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erro ao fazer login",
      error: error
    });
  }
};
```

### 📝 Como Funciona:

- `req.session` é criado automaticamente pelo `express-session`
- Ao atribuir valores (`req.session.userId = ...`), a sessão é salva no Redis
- O cookie é enviado automaticamente na resposta
- O navegador/cliente envia o cookie automaticamente nas próximas requisições

---

## 🛡️ PASSO 4: Atualizar Middleware de Autenticação

**Arquivo:** `src/middleware/EnsureAuthenticate.ts`

### Abordagem Híbrida (Recomendada):
Suporta **sessão** (web) **OU** **JWT** (mobile/API)

```typescript
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTService } from "../services/JWTService";

// Declaração de tipos para req.session
declare module 'express-session' {
  interface SessionData {
    userId: string;
    email: string;
    loggedIn: boolean;
  }
}

export const ensureAuthenticate: RequestHandler = async (req, res, next) => {
  // MÉTODO 1: Verificar se tem sessão ativa (web)
  if (req.session?.loggedIn && req.session?.userId) {
    // Sessão válida, adiciona userId no req para usar nos controllers
    (req as any).userId = req.session.userId;
    (req as any).userEmail = req.session.email;
    return next();
  }

  // MÉTODO 2: Verificar JWT (mobile/API)
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { message: "Não autenticado" },
    });
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Tipo de token inválido",
    });
  }

  const jwtData = JWTService.verify(token);

  if (jwtData === "JWT_SECRET_NOT_FOUND") {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Erro interno ao verificar o token",
    });
  }

  if (jwtData === "INVALID_TOKEN") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Token inválido",
    });
  }

  // JWT válido
  (req as any).userId = jwtData.uid;
  return next();
};
```

### 📝 Explicação:

1. **Primeiro tenta sessão** (para requisições web)
2. **Se não tem sessão, tenta JWT** (para mobile/API)
3. **Funciona com ambos** ao mesmo tempo
4. **Adiciona `userId` no `req`** para usar nos controllers

### 🔧 Declaração de Tipos:

Crie um arquivo `src/types/express-session.d.ts` (opcional, mas recomendado):

```typescript
declare module 'express-session' {
  interface SessionData {
    userId: string;
    email: string;
    loggedIn: boolean;
  }
}
```

Isso adiciona autocomplete no TypeScript para `req.session.userId`, etc.

---

## 🚪 PASSO 5: Criar Controller de Logout

**Arquivo:** `src/Controllers/controllerLogin/ControllerLogout.ts`

```typescript
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

export const Logout: RequestHandler = async (req, res) => {
  try {
    // Destroi a sessão no Redis
    req.session.destroy((err) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Erro ao fazer logout",
          error: err
        });
      }

      // Limpa o cookie do navegador
      res.clearCookie('sessionId'); // Use o mesmo nome que configurou no session

      return res.status(StatusCodes.OK).json({
        message: "Logout realizado com sucesso"
      });
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Erro ao fazer logout",
      error
    });
  }
};
```

### 📝 Explicação:

- `req.session.destroy()`: Remove a sessão do Redis
- `res.clearCookie()`: Remove o cookie do navegador
- O callback é necessário porque `destroy()` é assíncrono

---

## 👤 PASSO 6: Criar Controller para Verificar Sessão

**Arquivo:** `src/Controllers/controllerLogin/ControllerSession.ts`

```typescript
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

export const GetSession: RequestHandler = async (req, res) => {
  try {
    // Verifica se tem sessão ativa
    if (!req.session?.loggedIn || !req.session?.userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Sessão não encontrada ou expirada"
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Sessão ativa",
      session: {
        userId: req.session.userId,
        email: req.session.email,
        // Pode adicionar mais dados se necessário
      }
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Erro ao buscar sessão",
      error
    });
  }
};
```

---

## 🛣️ PASSO 7: Adicionar Rotas

**Arquivo:** `src/routes.ts`

```typescript
import { Router } from 'express';
import ControllerRotas from './Controllers/ControllerRotas';
// ... outros imports ...
import { Login } from './Controllers/controllerLogin/ControllerLogin';
import { Logout } from './Controllers/controllerLogin/ControllerLogout';
import { GetSession } from './Controllers/controllerLogin/ControllerSession';
// ... outros imports ...

const router = Router();

// ... outras rotas ...

router.post('/login', Login);
router.post('/logout', ensureAuthenticate, Logout);
router.get('/session', ensureAuthenticate, GetSession);

// ... resto das rotas ...
```

---

## 🧪 PASSO 8: Testar

### Teste 1: Login (deve criar sessão)

```bash
POST http://localhost:2000/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Verificar:**
- ✅ Resposta com `accessToken`
- ✅ Header `Set-Cookie` na resposta (contém o sessionId)

### Teste 2: Acessar rota protegida (com cookie)

```bash
GET http://localhost:2000/session
Cookie: sessionId=abc123... (o cookie enviado no login)
```

**Ou no navegador:**
- O cookie é enviado automaticamente
- Não precisa passar manualmente

### Teste 3: Logout

```bash
POST http://localhost:2000/logout
Cookie: sessionId=abc123...
```

**Verificar:**
- ✅ Sessão removida do Redis
- ✅ Cookie removido do navegador

### Teste 4: Tentar acessar após logout

```bash
GET http://localhost:2000/session
```

**Esperado:** Erro 401 (não autenticado)

---

## 🔍 Como Verificar Sessões no Redis

### Via Terminal Redis:

```bash
# Conectar ao Redis
redis-cli -h seu-host -p 10371 -a sua-senha

# Ver todas as chaves de sessão
KEYS sess:*

# Ver uma sessão específica
GET sess:abc123...

# Ver TTL (tempo restante)
TTL sess:abc123...
```

### Via Código (para debug):

```typescript
import client from './redis';

// Listar todas as sessões
const sessions = await client.keys('sess:*');
console.log('Sessões ativas:', sessions);

// Ver conteúdo de uma sessão
const sessionData = await client.get('sess:abc123...');
console.log('Dados da sessão:', sessionData);
```

---

## ⚙️ Configurações Avançadas

### 1. Variável de Ambiente para SESSION_SECRET

Adicione no `.env`:

```env
SESSION_SECRET=sua-chave-secreta-super-segura-aqui
```

### 2. Diferentes Configurações para Dev/Prod

```typescript
const sessionConfig = {
  store: new RedisStore({ client, prefix: "sess:" }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS em produção
    httpOnly: true,
    maxAge: 48 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
};

app.use(session(sessionConfig));
```

### 3. Regenerar Session ID (Segurança)

Para prevenir session fixation attacks:

```typescript
// Após login bem-sucedido
req.session.regenerate((err) => {
  if (err) {
    // tratar erro
    return;
  }
  
  req.session.userId = User.id;
  req.session.email = User.email;
  req.session.loggedIn = true;
});
```

---

## 🐛 Troubleshooting

### Problema 1: Cookie não está sendo enviado

**Solução:**
- Verifique se `credentials: true` está no CORS
- Verifique se o frontend está enviando `credentials: 'include'` nas requisições
- Verifique se está usando HTTPS em produção

### Problema 2: Sessão não persiste

**Solução:**
- Verifique se o Redis está conectado
- Verifique se `connectRedis()` foi chamado antes de configurar session
- Verifique logs do Redis para erros

### Problema 3: Sessão expira muito rápido

**Solução:**
- Aumente `maxAge` no cookie
- Verifique se `resave` e `saveUninitialized` estão configurados corretamente

### Problema 4: Erro "Cannot read property 'userId' of undefined"

**Solução:**
- Certifique-se que `express-session` está configurado ANTES das rotas
- Verifique se está usando `req.session?.userId` (optional chaining)

---

## 📊 Comparação: Sessão vs JWT

| Aspecto | Sessão (express-session) | JWT |
|---------|-------------------------|-----|
| **Armazenamento** | Redis (servidor) | Cliente (cookie ou header) |
| **Tamanho** | Pequeno (só ID) | Grande (todos os dados) |
| **Revogação** | Fácil (remove do Redis) | Difícil (até expirar) |
| **Segurança** | Alta (dados no servidor) | Média (dados no cliente) |
| **Escalabilidade** | Precisa Redis compartilhado | Não precisa (stateless) |
| **Uso** | Web apps | Mobile/API |

**Por isso a abordagem híbrida é melhor:**
- ✅ Sessão para web (mais seguro)
- ✅ JWT para mobile/API (mais flexível)

---

## ✅ Checklist Final

- [ ] Instalado `express-session` e `connect-redis`
- [ ] Configurado middleware de sessão no `index.ts`
- [ ] Adicionado `credentials: true` no CORS
- [ ] Modificado `ControllerLogin` para salvar sessão
- [ ] Atualizado `EnsureAuthenticate` para verificar sessão
- [ ] Criado `ControllerLogout`
- [ ] Criado `ControllerSession`
- [ ] Adicionado rotas `/logout` e `/session`
- [ ] Testado login e criação de sessão
- [ ] Testado acesso com cookie
- [ ] Testado logout
- [ ] Verificado sessões no Redis

---

## 🎓 Resumo

1. **express-session** gerencia tudo automaticamente
2. **connect-redis** salva sessões no Redis
3. **req.session** está disponível em todas as rotas
4. **Cookie** é enviado/recibido automaticamente
5. **Abordagem híbrida** permite usar sessão OU JWT

---

**Pronto! Agora você tem um sistema de sessão completo e profissional! 🚀**

