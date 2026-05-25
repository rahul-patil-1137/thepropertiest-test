import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const start = async (): Promise<void> => {
  // Connect to MongoDB
  await connectDB();

  // Start server
  const server = app.listen(env.PORT, () => {
    console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });

  // Graceful shutdown
  const shutdown = async (): Promise<void> => {
    console.log('\n🔄 Shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  // Handle unhandled rejections
  process.on('unhandledRejection', (err: Error) => {
    console.error('❌ Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });
};

start();
