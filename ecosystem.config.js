module.exports = {
  apps: [
    {
      name: "RiskCatch_api",
      script: "./src/server-register.js",
      instances: 2,
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "RiskCatch_prismaDB",
      script: "npm run studio",
      exec_mode: "fork",
      watch: false,
    },
  ],
};
