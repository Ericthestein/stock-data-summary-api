module.exports = {
  apps: [
    {
      name: "stock-data-summary-api",
      script: "dist/api.js",
    },
    {
      name: "redis-server",
      script: "redis-server",
    },
  ],
};
