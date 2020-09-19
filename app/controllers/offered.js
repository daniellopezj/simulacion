const utils = require('../middleware/utils')
const axios = require('axios');
var Mesa = require('../models/Mesa');
let socket;

const mesas = [new Mesa(0), new Mesa(1), new Mesa(2), new Mesa(3), new Mesa(4), new Mesa(5),
  new Mesa(6, new Mesa(7), new Mesa(8), new Mesa(9), new Mesa(10), new Mesa(11), new Mesa(12),
      new Mesa(13), new Mesa(14))];

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
    sendEvent('tables', { occupied: 2, available: 10, cleaning: 3 });
    sendEvent('clients', { table: 1, clients: 4 });
    sendEvent('clients', { table: 5, clients: 2 });
    sendEvent('leave', { table: 1 });
    sendEvent('clean', { table: 10 });
  });
};

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
  mesas.forEach(mesa => {
    if (mesa.estado == 1) {
      mesa.clientes = clientes;
      res.status(200).json({
        idMesa: mesa.id
      });
    }
  });
  //Codigo para asignar los clientes a alguna mesa
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
    if (changeStateMesa(idMesa, 1)) {
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
      mesa.id = newState;
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
  let mesasList = [];
  mesas.forEach(element => {
    mesasList.push({ idMesa: element.id, estado: element.estado })
  });
  return mesasList;
}
