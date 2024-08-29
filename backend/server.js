process.on('uncaughtException', (err) => {
  console.error(`Global UncaughtException Handler, 💥 Shutting Down`);
  console.error(err.name, err.message);
  process.exit(1);
});

import 'dotenv/config';
import app from './app.js';

const port = Number(process.env.port) || 8000;

/* Whenever you update your Prisma schema, you will have to update your database schema using either 
prisma migrate dev or prisma db push. This will keep your database schema in sync with your Prisma 
schema. The commands will also regenerate Prisma Client. */

const server = app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Global unhandledRejection Handler, 💥 Shutting Down`);
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});
