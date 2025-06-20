require("dotenv").config();

const { DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REPO, DEPLOY_BRANCH } = process.env;

module.exports = {
  apps: [
    {
      name: "backend",
      script: "dist/main.js",
      cwd: "./backend",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "development", // По умолчанию
        PORT: 3000,
      },
      env_production: { // Явное определение production окружения
        NODE_ENV: "production",
        PORT: 3000
      }
    },
    {
      name: "frontend",
      script: "npm run dev",
      cwd: "./frontend",
      interpreter: "none",
      instances: 1,
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: "production"
      }
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_BRANCH,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      "pre-deploy-local": `
        echo "=== Копирование .env файлов ===" &&
        echo "Копируем backend.env..." &&
        [ -f backend/.env ] && scp backend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/backend.env || echo "Warning: backend/.env не найден" &&
        echo "Копируем frontend.env..." &&
        [ -f frontend/.env ] && scp frontend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/frontend.env || echo "Warning: frontend/.env не найден"
      `,
      "post-deploy": `
        echo "=== Настройка окружения ===" &&
        mkdir -p ${DEPLOY_PATH}/source/backend ${DEPLOY_PATH}/source/frontend &&
        
        echo "Копируем .env файлы..." &&
        [ -f ${DEPLOY_PATH}/shared/backend.env ] && cp ${DEPLOY_PATH}/shared/backend.env ${DEPLOY_PATH}/source/backend/.env || echo "Warning: backend.env не найден" &&
        [ -f ${DEPLOY_PATH}/shared/frontend.env ] && cp ${DEPLOY_PATH}/shared/frontend.env ${DEPLOY_PATH}/source/frontend/.env || echo "Warning: frontend.env не найден" &&
        
        echo "=== Обновление кода ===" &&
        cd ${DEPLOY_PATH}/source &&
        git fetch --all &&
        git reset --hard ${DEPLOY_BRANCH} &&
        
        echo "=== Установка зависимостей ===" &&
        npm ci --prefix backend --legacy-peer-deps &&
        npm ci --prefix frontend &&
        
        echo "=== Сборка проекта ===" &&
        npm run build --prefix backend &&
        
        echo "=== Перезапуск сервисов ===" &&
        pm2 reload ecosystem.config.js --env production &&
        
        echo "=== Деплой завершен успешно! ==="
      `,
      env: {
        NODE_ENV: "production"
      }
    }
  }
};
