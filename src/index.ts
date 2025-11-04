import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes';
import { testConnection } from './prisma'
import { connectRedis } from './redis'; 
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import client from './redis'

dotenv.config();

const app = express();

app.use(session({
  store: new RedisStore({
    client: client,
    prefix: "sess"
  }),
  secret: (() => {
    const secret = process.env.SESSION_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('SESSION_SECRET ou JWT_SECRET deve estar configurado em produção');
      }
      console.warn('⚠️  SESSION_SECRET não configurado. Usando secret temporário apenas para desenvolvimento.');
      return 'sdasdibsoadb';
    }
    return secret;
  })(),
  resave: false,
  saveUninitialized: false,
  name: "SessionId",
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 48 * 60 * 60 * 1000,
    sameSite: 'strict'
  }
}))

app.use(express.json()); 
app.use(cors({
  origin : process.env.ENABLED_CORS,
  credentials: true
}));      
app.use(routes);       

const PORT = process.env.PORT || 2000;

connectRedis();
app.listen(PORT, () => {
  testConnection()
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}/`);
});
