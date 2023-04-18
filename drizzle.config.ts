import type { Config } from 'drizzle-kit'

export default {
  out: './migrations',
  schema: './src/db/schema.ts',
  breakpoints: true,
  connectionString: 'mysql://root:root@localhost:3306/drago?charset=utf8mb4'
} satisfies Config
