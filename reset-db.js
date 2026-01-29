const postgres = require('postgres');

const DATABASE_URL = "postgresql://neondb_owner:npg_bH15zskoCviK@ep-purple-term-a10wzjlh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function resetDB() {
    const sql = postgres(DATABASE_URL);
    try {
        console.log('Resetting production database users/accounts data...');
        await sql`DELETE FROM accounts`;
        await sql`DELETE FROM sessions`;
        await sql`DELETE FROM users`;
        console.log('Done! All users and accounts cleared.');
    } catch (error) {
        console.error('Error resetting DB:', error);
    } finally {
        await sql.end();
    }
}

resetDB();
