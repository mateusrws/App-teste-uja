import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from '../routes';
import { testConnection } from '../knex'

dotenv.config();

const app = express();

app.use(express.json()); // Permite receber JSON no corpo das requisições
app.use(cors({
  origin : process.env.ENABLED_CORS
}));      
app.use(routes);       

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  testConnection()
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}/`);
});
