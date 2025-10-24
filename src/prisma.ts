import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

export async function testConnection() {
    try {
        await prisma.$queryRaw`SELECT 1+1 as result`;
        console.log('✅ Conexão com o banco de dados bem-sucedida!');
    } catch (error) {
        console.log('❌ Erro ao conectar com o banco de dados: ', error);
    }
}

export default prisma;
