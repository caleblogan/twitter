import pg from "pg"
import { config } from "./config";

const pool = new pg.Pool({
    user: config.pgUser,
    password: config.pgPassword,
    host: config.pgHost,
    database: config.pgDatabase,
});


export default pool;