const Alisa = require("./index");
require('dotenv').config()

const token = process.env.TOKEN
const alisa = new Alisa({ token, debug: true })

// app.setToken(process.env.TOKEN || '')

alisa.on("message", (message) => {
  console.log(JSON.stringify(message, null, 2));
});
alisa.on("open", (message) => {
  console.log(message);
});

alisa.start()