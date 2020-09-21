const utils = require('../middleware/utils')
const axios = require('axios');
var Mesa = require('../models/Mesa');
let socket;

const mesas = [new Mesa(0), new Mesa(1), new Mesa(2), new Mesa(3), new Mesa(4), new Mesa(5),
new Mesa(6), new Mesa(7), new Mesa(8), new Mesa(9), new Mesa(10), new Mesa(11), new Mesa(12),
new Mesa(13), new Mesa(14)];

/*********************
* Private functions *
*********************/

const getData = () => new Promise((resolve, reject) => {
  const data = { test: "test" }
  resolve(mesas)
  //reject(error) // Esto solo se utiliza para cuando la promesa retorna un error. Es por si lo necesitan
})

const enviarDato = (url, data) => {
  axios.post(url, data)
    .then(res => {
      console.log(res.body);
    })
    .catch(error => {
      console.log(error);
    });
}


/********************
 * Sockets *
 ********************/
const sendEvent = (name, message) => {
  socket.emit(name, message);
};

exports.initSocket = (io) => {
  io.on('connection', s => {
    console.log('Hola Pues!');
    socket = s;
    sendEvent('hi', 'Hola');
    sendEvent('tables', getSocketTables());
    sendEvent('clients', { table: 1, clients: 4 });
    sendEvent('clients', { table: 5, clients: 2 });
    sendEvent('leave', { table: 1 });
    sendEvent('clean', { table: 10 });
  });
};

// Obtener la lista de mesas disponibles, ocupadas y en limpieza
function getSocketTables() {
  var countOccupied = countTablesStates(5) + countTablesStates(6);
  var countAvailable = countTablesStates(1);
  var countCleaning = countTablesStates(4);
  return { occupied: countOccupied, available: countAvailable, cleaning: countCleaning }
}

function countTablesStates(state) {
  var count = 0;
  mesas.forEach(mesa => {
    if (mesa.estado === state) {
      count++;
    }
  });
  return count;
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
exports.verificar_disponibilidad = async (req, res) => {
  //Verifica si hay alguna mesa vacia
  disponibilidad = false;
  mesas.forEach(mesa => {
    if (mesa.estado == 1) {
      disponibilidad = true;
    }
  });
  if (disponibilidad) {
    res.status(200).json({ disponible: true });
  } else {
    res.status(200).json({ disponible: false });
  }
}

// sockets clients
//Asignar clientes
exports.asignar_mesa = async (req, res) => {
  const clientes = req.body;  //Recibe la lista de clientes para asignarlos a una mesa
  console.log(clientes);
  var mesa = getPosDisponible();

  if (mesa != undefined) {
    //estado sin atender
    mesa.estado = 5;
    mesa.clientes = clientes;
    sendEvent('tables', getSocketTables());
    sendEvent('clients', { table: mesa.id, clients: mesa.clientes.length });
    res.status(200).json({
      idMesa: mesa.id
    });

    recibirEnviarMenu();
  } else {
    res.status(400).json({ status: 'No hay mesas disponibles' });
  }
  //sendEvent('clients', { table: mesa.id, clients: mesa.clientes.length });

  /*
  mesas.forEach(mesa => {
    if (mesa.estado == 1) {
      mesa.clientes = clientes;
      mesa.estado = 5;
      res.status(200).json({
        idMesa: mesa.id
      });
    }
  });
  */
  //Codigo para asignar los clientes a alguna mesa
}


function recibirEnviarMenu() {
  axios.get('/"ruta que obtiene el menu"')
    .then(response => {
      var menu = response;
      enviarDato("urlClientes", menu);
    })
    .catch(e => {
      // Podemos mostrar los errores en la consola
      console.log(e);
    })
}

// devuelve la primera mesa disponible que encuentre
function getPosDisponible() {
  return mesas[mesas.findIndex(mesa => mesa.estado === 1)];
}

// sockets order
exports.postRecibirPedido = async (req, res) => {
  try {
    const data = req.body //retorna el mismo objeto enviado
    console.log(data);

    //enviarPedido(data)
    enviarDato("falta url", data);
    res.status(200).json({ status: 'Pedido recibido' })
  } catch (error) {
    utils.handleError(res, error)
  }
}

//los clientes nos pasan los pedidos
exports.solicitarPedido = async (req, res) => {
  var data = req.body;
  console.log(data);
  res.status(200).json({ status: 'Pedido recibido' })
}


exports.cualquierRuta = async (req, res) => {
  try {
    const data = await getData()
    res.status(201).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

// *************  MENDEZ  *****************************

// sockets leave
//   Los clientes notifican cuando abandonan la mesa
exports.postAbandonarMesa = async (req, res) => {
  try {
    let idMesa = req.body.idMesa;
    if (!idMesa) res.status(404).json({ status: 'La id de la mesa es requerida (idMesa)' });
    var data = { status: "Los clientes abandonaron la mesa" }
    if (changeStateMesa(idMesa, 3)) {
      sendEvent('leave', { table: idMesa });
      res.status(200).json(data);
    } else {
      data = { status: "Error al abandonar la mesa" };
      res.status(404).json(data);
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

// sockets clean
//   El mesero limpia una mesa
exports.postLimpiarMesa = async (req, res) => {
  try {
    let idMesa = req.body.idMesa;
    var data = { status: "Mesa limpia" }
    if (changeStateMesa(idMesa, 4)) {
      sendEvent('tables', getSocketTables());
      res.status(200).json(data);
    } else {
      data = { status: "Error al limpiar mesa" };
      res.status(404).json(data);
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

// sockets tables
//cambiar estado de mesa
function changeStateMesa(idMesa, newState) {
  var state = false;
  mesas.forEach(mesa => {
    if (mesa.id === idMesa) {
      mesa.estado = newState;
      state = true;
    }
  });
  return state;
}

//   Enviar la lista de mesas con sus estados
exports.getEstadosMesas = async (req, res) => {
  try {
    const data = getEstadosMesas();
    res.status(201).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

// metodo para obtener la lista de idMesa con su estado
function getEstadosMesas() {
  console.log(mesas.length);
  let mesasList = [];
  mesas.forEach(element => {
    console.log(element);
    mesasList.push({ idMesa: element.id, estado: element.estado })
  });
  return mesasList;
}
