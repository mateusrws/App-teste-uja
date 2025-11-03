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
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'sdasdibsoadb',
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
