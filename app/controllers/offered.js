const utils = require('../middleware/utils')

/*********************
 * Private functions *
 *********************/

const getData = () => new Promise((resolve, reject) => {
  const data = { test: "test" }
  resolve(data)
  //reject(error) // Esto solo se utiliza para cuando la promesa retorna un error. Es por si lo necesitan 
})
/********************
 * Public functions *
 ********************/
exports.getTest = async (req, res) => {
  try {
    const data = await getData()
    res.status(201).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}
exports.postTest = async (req, res) => {
  try {
    const data = req.body //retorna el mismo objeto enviado 
    res.status(200).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.postRecibir_pedido = async (req, res) => {
  try {
    const data = req.body //retorna el mismo objeto enviado 

    if (!data.idMesa) res.status(404).json({message:'La id de la mesa es requerida'})

    res.status(200).json({message:'Pedido recibido'})
  } catch (error) {
    utils.handleError(res, error)
  }
}


exports.cualquierRuta = async (req, res) => {
  try {
    const data = await getData()
    res.status(201).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}



//   Los clientes notifican cuando abandonan la mesa 
exports.postAbandonarMesa = async (req, res) => {
  try {
    let idMesa = req.body;
    const data = { status: "los usuarios han abandonado la mesa :)" }
    res.status(200).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

//   El mesero limpia una mesa
exports.postLimpiarMesa = async (req, res) => {
  try {
    let idMesa = req.body;
    const data = { status: "Mesa limpia" }
    res.status(200).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

//   Enviar la lista de mesas con sus estados
exports.getEstadosMesas = async (req, res) => {
  try {
    const data = [{idMesa: 1, estadoMesa: "disponible"}, {idMesa: 2, estadoMesa: "ocupada"},{idMesa: 3, estadoMesa: "sin_limpieza"},{idMesa: 4, estadoMesa: "e_limpieza"}];
    res.status(201).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}