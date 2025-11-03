import { createClient } from 'redis';

const redisHost = process.env.HOST_REDIS;
const redisPort = process.env.PORT_REDIS ? parseInt(process.env.PORT_REDIS) : 10371;

if (!redisHost) {
  console.warn('⚠️  HOST_REDIS não configurado. A conexão Redis pode falhar.');
}

const client = createClient({
  username: process.env.USER_REDIS,
  password: process.env.PASSWORD_REDIS,
  socket: {
    host: redisHost,
    port: redisPort
  }
});

client.on('error', (err) => {
  console.error('❌ Redis Client Error:', err.message);
  if (err.message.includes('ENOTFOUND')) {
    console.error('💡 Verifique se o HOST_REDIS está correto e acessível.');
  }
});

let isConnected = false;
let connectionPromise: Promise<typeof client> | null = null;

export async function connectRedis(): Promise<typeof client> {
  if (!redisHost) {
    throw new Error('HOST_REDIS não está configurado nas variáveis de ambiente');
  }

  // Se já existe uma conexão em andamento, aguarda ela
  if (connectionPromise) {
    return connectionPromise;
  }

  // Se já está marcado como conectado, retorna o cliente
  // (evita múltiplas conexões)
  if (isConnected) {
    return client;
  }

  // Cria uma nova promessa de conexão
  connectionPromise = (async () => {
    try {
      await client.connect();
      isConnected = true;
      connectionPromise = null;
      console.log("✅ Redis conectado com sucesso!");
      return client;
    } catch (err) {
      isConnected = false;
      connectionPromise = null;
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      
      // Se o erro for "Socket already opened", significa que já está conectado
      if (errorMessage.includes('Socket already opened') || errorMessage.includes('already connected')) {
        isConnected = true;
        connectionPromise = null;
        return client;
      }
      
      console.error("❌ Erro ao conectar no Redis:", errorMessage);
      
      if (errorMessage.includes('ENOTFOUND')) {
        console.error(`💡 Não foi possível resolver o hostname: ${redisHost}`);
        console.error('💡 Verifique:');
        console.error('   1. Se o HOST_REDIS está correto no arquivo .env');
        console.error('   2. Se há conectividade de rede com o servidor Redis');
        console.error('   3. Se o serviço Redis está online');
      }
      
      throw err;
    }
  })();

  return connectionPromise;
}

export default client;
