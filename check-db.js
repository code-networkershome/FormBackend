const postgres = require('postgres');

const DATABASE_URL = "postgresql://neondb_owner:npg_bH15zskoCviK@ep-purple-term-a10wzjlh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function showUser() {
    const sql = postgres(DATABASE_URL);
    try {
        const user = await sql`SELECT * FROM users LIMIT 1`;
        console.log('User internal details:', JSON.stringify(user[0], null, 2));
    } catch (error) {
        console.error('Error querying user:', error);
    } finally {
        await sql.end();
    }
}

showUser();
