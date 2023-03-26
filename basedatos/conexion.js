const mongoose = require("mongoose");

const conexion = async () => {
  try {
//    await mongoose.connect("mongodb:/localhost:27017/mi_blog");
   await mongoose.connect("mongodb://0.0.0.0:27017/mi_blog");
    //parametros dentro de un objeto //solo en caso de aviso
    //useNewUrlParse:true
    //useUnifiedTopology:true
    //useCreateIndex:true
    console.log("conectado correctamente a la bd mi_blog");
  } catch (error) {
    console.log(error);
    throw new Error("No se ha podido conectar a la base de datos");
  }
};

module.exports={
    conexion
}