require("dotenv").config();

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REPO = "https://github.com/Alex-Ven/film-react-nest.git",
  DEPLOY_BRANCH = "origin/review",
} = process.env;

module.exports = {
  apps: [
    {
      name: "backend",
      script: "dist/main.js",
      cwd: "./backend",
      args: "",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "frontend",
      script: "npm",
      args: "run dev",
      cwd: "./frontend",
      interpreter: "none",
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_BRANCH,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      "pre-deploy": `
      echo "Copying .env to server..." &&
      scp .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/ &&
      scp backend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/backend.env &&
      scp frontend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/frontend.env`,
      "post-deploy": `
        echo "Setting up environment..." &&
        cp ${DEPLOY_PATH}/shared/backend.env ${DEPLOY_PATH}/source/backend/.env &&
        cp ${DEPLOY_PATH}/shared/frontend.env ${DEPLOY_PATH}/source/frontend/.env &&

        echo "Installing dependencies..." &&
        cd ${DEPLOY_PATH}/source &&
        git fetch --all &&
        git reset --hard ${DEPLOY_BRANCH} &&

        echo "Building backend..." &&
        npm install --prefix backend --legacy-peer-deps &&
        npm run build --prefix backend &&

        echo "Starting services..." &&
        pm2 reload ecosystem.config.js --env production &&

        echo "Deployment completed successfully!"
      `,
      env: {
        NODE_ENV: "production",
      },
    },
  },
};
