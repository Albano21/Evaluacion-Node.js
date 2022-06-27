const express = require("express")
const personas = require("./routers/personas")
const telefonos = require("./routers/telefonos")

const app = express()

app.use("/personas/", personas.router)
app.use("/telefonos/", telefonos.router)

app.listen(8080)
