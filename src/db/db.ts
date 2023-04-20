import { drizzle } from 'drizzle-orm/mysql2'

import mysql from 'mysql2/promise'

const poolConnection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'drago'
})

export const db = drizzle(poolConnection, {
  logger: process.env.NODE_ENV === 'development'
})
