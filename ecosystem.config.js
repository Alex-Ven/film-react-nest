require('dotenv').config();

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REPO = 'https://github.com/Alex-Ven/film-react-nest.git', 
  DEPLOY_BRANCH = 'origin/review',
} = process.env;

module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'dist/main.js',
      cwd: './backend',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './frontend',
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      watch: false
    }
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_BRANCH,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      pre_deploy: `
      echo "Copying .env to server..." &&
      scp .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared`,
      'post-deploy': `
        echo "Starting deployment..." &&
        cd ${DEPLOY_PATH}/source &&
        git fetch --all &&
        git reset --hard ${DEPLOY_BRANCH} &&
        npm install --prefix backend --legacy-peer-deps &&
        npm run build --prefix backend &&
        pm2 reload ecosystem.config.js --env production &&
        echo "Deployment completed successfully!"
      `,
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
