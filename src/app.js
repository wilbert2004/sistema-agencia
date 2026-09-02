//importamos express
const express = require("express");
//importamos cors
const cors = require("cors");

//crearemos la app para el exprees
const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//importamos las rutas
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API de sistema de agencia",
  });
});

module.exports = app;
