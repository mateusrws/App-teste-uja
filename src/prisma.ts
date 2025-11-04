import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

export async function testConnection() {
    try {
        if (!process.env.DATABASE_URL) {
            console.error('❌ DATABASE_URL não está configurada no arquivo .env');
            return;
        }

        await prisma.$queryRaw`SELECT 1+1 as result`;
        console.log('✅ Conexão com o banco de dados bem-sucedida!');
    } catch (error: any) {
        console.error('❌ Erro ao conectar com o banco de dados:');
        
        if (error?.code === 'ENOTFOUND' || error?.message?.includes("Can't reach database server")) {
            console.error('💡 Possíveis causas:');
            console.error('   1. O banco de dados Neon pode estar pausado (verifique no dashboard do Neon)');
            console.error('   2. A DATABASE_URL pode estar incorreta');
            console.error('   3. Problemas de conexão de rede/firewall');
            console.error('   4. Tente usar a URL direta em vez do pooler (remova "-pooler" da URL)');
        } else if (error?.code === 'P1001') {
            console.error('💡 Não foi possível alcançar o servidor do banco de dados.');
            console.error('   Verifique se o banco Neon está ativo e a URL está correta.');
        } else {
            console.error('   Erro:', error?.message || error);
        }
        
        // Não interrompe a aplicação, apenas loga o erro
    }
}

export default prisma;
