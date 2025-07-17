// Database configuration for Shiki Extender
module.exports = {
  dbConfig: {
    host: 'localhost',
    port: 5432,
    database: 'shiki_extender',
    user: 'postgres',
    password: 'your_password_here',
    // Дополнительные опции для production
    ssl: false,
    max: 10, // максимум соединений в пуле
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
};

// Для разработки можно использовать переменные окружения
if (process.env.NODE_ENV === 'development') {
  // Переопределить настройки для разработки
  module.exports.dbConfig.database = process.env.DB_NAME || 'shiki_extender_dev';
  module.exports.dbConfig.user = process.env.DB_USER || 'postgres';
  module.exports.dbConfig.password = process.env.DB_PASSWORD || 'postgres';
  module.exports.dbConfig.host = process.env.DB_HOST || 'localhost';
  module.exports.dbConfig.port = process.env.DB_PORT || 5432;
}

// Для Docker или продакшна
if (process.env.DATABASE_URL) {
  // Парсим DATABASE_URL для Heroku/Docker
  const url = require('url');
  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');
  
  module.exports.dbConfig = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: { rejectUnauthorized: false }
  };
}
