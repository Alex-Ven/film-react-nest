require("dotenv").config();

const { DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REPO, DEPLOY_BRANCH } =
  process.env;

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
      "pre-deploy-local": `
        echo "Copying environment files..." &&
        
        echo "Copying backend.env..." &&
        scp backend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/backend.env &&
        echo "Copying frontend.env..." &&
        scp -v frontend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/frontend.env
`,
      "post-deploy": `
        echo "Preparing environment..." &&
        mkdir -p ${DEPLOY_PATH}/source/backend ${DEPLOY_PATH}/source/frontend &&
        [ -f ${DEPLOY_PATH}/shared/backend.env ] && cp ${DEPLOY_PATH}/shared/backend.env ${DEPLOY_PATH}/source/backend/.env || echo "Warning: backend.env not found" &&
        [ -f ${DEPLOY_PATH}/shared/frontend.env ] && cp ${DEPLOY_PATH}/shared/frontend.env ${DEPLOY_PATH}/source/frontend/.env || echo "Warning: frontend.env not found" &&

        echo "Updating code..." &&
      
        git fetch --all &&
        git reset --hard ${DEPLOY_BRANCH} &&

        echo "Installing dependencies..." &&
        npm install --prefix backend --legacy-peer-deps &&
        npm install --prefix frontend &&

        echo "Building backend..." &&
        npm run build --prefix backend &&

        echo "Restarting services..." &&
        cd ${DEPLOY_PATH}/source &&
        pm2 startOrRestart ecosystem.config.js --env production

        echo "Deployment completed successfully!"
      `,
      env: {
        NODE_ENV: "production",
      },
    },
  },
};
