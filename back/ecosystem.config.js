module.exports = {
  apps : [{
    name   : "final_project_server",
    script : "./dist/src/app.js",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
