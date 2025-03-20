import initApp from "./server";
import https from 'https'
import http from 'http'
import fs from 'fs'
import path from "path";

const port = process.env.PORT||3000;

initApp().then((app) => {
  if(process.env.NODE_ENV !== 'production') {
    console.log('development')
    http.createServer(app).listen(port, () => {
      console.log("App is live in development")
    })
  }

  const keyPath = path.join(__dirname, '../../../client-key.pem');
  const certPath = path.join(__dirname, '../../../client-cert.pem');

  const options = {
    key: fs.readFileSync(`${keyPath}`),
    cert: fs.readFileSync(`${certPath}`)
  }
  https.createServer(options, app).listen(port, () => {
    console.log("App is live in production")
  })
}); 