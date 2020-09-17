const utils = require('../middleware/utils')
const axios = require('axios');
var Mesa  = require('../models/mesa');
const mesas = [new Mesa(0),new Mesa(1),new Mesa(2),new Mesa(3),new Mesa(4),new Mesa(5),
  new Mesa(6,new Mesa(7),new Mesa(8),new Mesa(9),new Mesa(10),new Mesa(11),new Mesa(12),
  new Mesa(13),new Mesa(14))];

/*********************
 * Private functions *
 *********************/

const getData = () => new Promise((resolve, reject) => {
  const data = { test: "test" }
  resolve(mesas)
  //reject(error) // Esto solo se utiliza para cuando la promesa retorna un error. Es por si lo necesitan 
})

const enviarPedido = (data) => {
  axios.post("urlCocina"+"/recibirPedido",data)
        .then(res => {
           console.log(res.body);
        })
        .catch(error => {
           console.log(error);
        });
}
  
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
//*************NICOLAS */
//Verificar disponibilidad de mesas por los meseros
exports.verificar_disponibilidad = async(req, res)=>{
  //Verifica si hay alguna mesa vacia
  if(true){
    res.status(200).json({disponible: true});
  }else{
    res.status(200).json({disponible: false});
  }
}

//Asignar clientes
exports.asignar_mesa = async(req, res)=>{
  const clientes = req.body;  //Recibe la lista de clientes para asignarlos a una mesa
  console.log(clientes);
  //Codigo para asignar los clientes a alguna mesa
  res.status(200).json({
    idMesa: 1
  });
}

exports.postRecibirPedido = async (req, res) => {
  try {
    const data = req.body //retorna el mismo objeto enviado 
    console.log(data);
    if (!data.idMesa) res.status(404).json({status:'La id de la mesa es requerida (idMesa)'})
    if (!data.clientes) res.status(404).json({status:'La lista de clientes con su pedido es requerida'})
    if (data.clientes.length == 0) res.status(404).json({status:'La lista de clientes no puede estar vacia'})
    if (!data.codFactura) res.status(404).json({status:'EL codigo de la factura es requerido (codFactura)'})
    if (!data.valorTotal) res.status(404).json({status:'el valor total del pedido es requerido (valorTotal)'})
    //enviarPedido(data)
    res.status(200).json({status:'Pedido recibido'})
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