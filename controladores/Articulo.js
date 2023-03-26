const fs = require("fs");
const path = require("path");
const { validarArticulo } = require("../helpers/validar");
const Articulo = require("../modelos/Articulo");

const prueba = (req, res) => {
  return res.status(200).json({
    mensaje: "soy una accion de prueba en mi controlador de articulos",
  });
};

const crear = async (req, res) => {
  // recoger los parametros por post a guardar
  let parametros = req.body;

  // validar los datos
  try {
    validarArticulo( parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }
  // crear el objeto a guardar
  // asignar valores al objeto
  const articulo = new Articulo(parametros);

  // // guardar el articulo en la base de datos
  await articulo
    .save()
    .then((articuloGuardado) => {
      // Devolver resultado
      return res.status(200).json({
        status: "Success",
        articulo: articuloGuardado,
        mensaje: "el articulo se ha creado correctamente",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        status: "Error",
        mensaje: "No se ha guardado el artículo",
      });
    });
};

const listar = (req, res) => {
  
    let consulta = Articulo.find({});
    if (req.params.ultimos) {
      consulta.limit(2);
    }
    consulta
      .sort({ fecha: -1 })
      .then((articulos) => {
        return res.status(200).json({
          status: "success",
          parametro: req.params.ultimos,
          articulos,
        });
      })
      .catch((error) => {
        return res.status(404).json({
          status: "error",
          mensaje: "no se han encontrado articulos",
        });
      });
 
  
};

const uno = (req, res) => {
  // recoger un id por la url
  let id = req.params.id;

  // buscar el articulo
  Articulo.findById(id)
    .then((articulo) => {
      // devolver el resultado
      return res.status(200).json({
        status: "success",
        articulo,
      });
    })
    .catch((error) => {
      // si no existe devolver un error
      return res.status(404).json({
        status: "error",
        mensaje: "no se han encontrado el articulo",
      });
    });
};

const borrar = (req, res) => {
  let articuloId = req.params.id;
  Articulo.findOneAndDelete({ _id: articuloId })
    .then((articuloBorrado) => {
      // devolver el resultado
      return res.status(200).json({
        status: "success",
        mensaje: "se ha borrado el articulo",
        articulo: articuloBorrado,
      });
    })
    .catch((error) => {
      // si no existe devolver un error
      return res.status(500).json({
        status: "error",
        mensaje: "no se han encontrado el articulo",
      });
    });
};

const editar = (req, res) => {
  let articuloId = req.params.id;
  // recoger los datos del body
  let parametros = req.body;
  // validar datos
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }
  // buscar y actualizar articulo
  Articulo.findByIdAndUpdate({ _id: articuloId }, req.body, { new: true })
    .then((articuloActualizado) => {
      // devolver el resultado
      return res.status(200).json({
        status: "success",
        mensaje: "se ha actualizado el articulo",
        articulo: articuloActualizado,
      });
    })
    .catch((error) => {
      // si no existe devolver un error
      return res.status(500).json({
        status: "error",
        mensaje: "no se ha logrado actualizar el articulo",
      });
    });
};

const subir = (req, res) => {
  // configurar el multer
  // recoger el fichero de imagen subido
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "error",
      mensaje: "peticion invalida",
    });
  }
  // nombre del archivo
  let archivo = req.file.originalname;
  // extension del archivo
  let archivo_split = archivo.split(".");
  let extension = archivo_split[1];

  // comprobar extenxion correcta
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    // borrar archivo y dar respuesta
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "imagen invalida",
      });
    });
  } else {
    let id = req.params.id;

    // buscar y actualizar articulo
    Articulo.findByIdAndUpdate(
      { _id: id },
      { imagen: req.file.filename },
      { new: true }
    )
      .then((articuloActualizado) => {
        // devolver el resultado
        return res.status(200).json({
          status: "success",
          articulo: articuloActualizado,
          fichero: req.file,
        });
      })
      .catch((error) => {
        // si no existe devolver un error
        return res.status(500).json({
          status: "error",
          mensaje: "no se ha logrado actualizar el articulo",
        });
      });
  }
};

const imagen = (req, res) => {
  let fichero = req.params.fichero;
  let ruta_fisica = "./imagenes/articulos/" + fichero;
  fs.stat(ruta_fisica, (error, existe) => {
    if (existe) {
      return res.sendFile(path.resolve(ruta_fisica));
    } else {
      return res.status(404).json({
        status: "error",
        mensaje: "la imagen no existe",
      });
    }
  });
};

const buscador = (req, res) => {
  // sacar el string de busqueda
  let busqueda = req.params.busqueda;
  // find OR
  Articulo.find({
    $or: [
      { titulo: { $regex: busqueda, $options: "i" } },
      { contenido: { $regex: busqueda, $options: "i" } },
    ],
  })
    .sort({ fecha: -1 })
    .then((articulosEncontrados) => {
    
         // si se encontraron resultados, devolverlos
      if (articulosEncontrados && articulosEncontrados.length > 0) {
        return res.status(200).json({
          status: "success",
          articulos: articulosEncontrados,
        });
      } else {
        // si no existe devolver un error
        return res.status(404).json({
          status: "error",
          mensaje: "no se ha encontrado el articulo",
        });
      }
    })
    .catch((error = !articulosEncontrados||articulosEncontrados.length <=0)=> {
      // manejar el error
      console.error(error);
      return res.status(500).json({
        status: "error",
        mensaje: "ocurrió un error al buscar los artículos",
      });
    });

  // orden
  // ejecutar consulta
  // devolver resultado
};

module.exports = {
  prueba,
  crear,
  listar,
  uno,
  borrar,
  editar,
  subir,
  imagen,
  buscador,
};
