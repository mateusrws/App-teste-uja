import knex from 'knex';
import env from 'dotenv'
env.config()

const db = knex({
    client: 'postgresql',
    connection: process.env.DATABASE_URL
})

export async function testConnection(){
    try {
        await db.raw('select 1+1 as result');
        console.log('✅ Conexão com o banco de dados bem-sucedida!');
    } catch (error) {
        console.log('❌ Erro ao conectar com o banco de dados: ', error);
    }
}

export default db;
