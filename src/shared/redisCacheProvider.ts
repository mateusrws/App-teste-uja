import client, { connectRedis } from "../redis";

class RedisCacheProvider {
  private client: typeof client | null = null;

  constructor() {
    // Aguarda a conexão antes de atribuir o cliente
    connectRedis()
      .then(() => {
        this.client = client;
      })
      .catch(() => {
        // Em caso de erro, ainda tenta usar o cliente (pode já estar conectado)
        this.client = client;
      });
  }

  async save(key: string, value: unknown, ttlSeconds = 60) {
    if (!this.client) return;

    await this.client.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  }

  async recover<T>(key: string): Promise<T | null> {
    if (!this.client) return null;

    const data = await this.client.get(key);

    return data ? (JSON.parse(data) as T) : null;
  }

  async invalidate(key: string) {
    if (!this.client) return;
    await this.client.del(key);
  }
}

export const redisCache = new RedisCacheProvider();
