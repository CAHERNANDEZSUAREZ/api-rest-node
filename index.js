const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");

//inicializar app
console.log("App de node arrancada");

//conectar a la base datos
conexion();

// crear servidor node
const app = express();
const puerto = 3900;

// configurar cars
app.use(cors());

// convertir el body en objeto js
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//crear rutas
const rutas_articulo=require("./rutas/articulo")
// cargo las rutas
app.use("/api",rutas_articulo)

//rutas hardcodeadas
app.get("/probando", (req, res) => {
  console.log("se ha ejecutado el endpoint probando");
  return res.status(200).json([{
    curso:"master en react",
    autor:"cristhian anderson",
    url:"cristhianandersonweb.pe/master-react"},
    {
        curso:"master en react",
        autor:"cristhian anderson",
        url:"cristhianandersonweb.pe/master-react"}]);
});

app.get("/blog", (req, res) => {
    console.log("se ha ejecutado el endpoint blog");
    return res.status(200).json({ 
          curso:"master en react",
          autor:"cristhian anderson",
          url:"cristhianandersonweb.pe/master-react"});
  });

// crear servidor y escuchar peticiones http
app.listen(puerto, () => {
  console.log("servidor corriendo en el puerto " + puerto);
});
