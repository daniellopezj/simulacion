const express = require('express')
const controller = require('../controllers/offered')
const router = express.Router()

router.get(
  '/cualquirRutacualquirRuta',
  controller.cualquierRuta
)

router.post(
  '/',
  controller.postTest
)

router.get(
  '/',
  controller.getTest
)

//Los meseros verifican si hay mesas vacias
router.get(
  '/verificarDisponibilidad',
  controller.verificar_disponibilidad
)

//Asignar mesa a los clientes
router.post(
  '/asignarMesa',
  controller.asignar_mesa
)

router.post(
  '/recibirPedido',
  controller.postRecibirPedido
)
//Los clientes notifican cuando abandonan la mesa 
router.post(
  '/abandonarMesa',
  controller.postAbandonarMesa
)


//El mesero limpia una mesa
router.post(
  '/limpiarMesa',
  controller.postLimpiarMesa
)

//El mesero obtiene la lista de mesas
router.get(
  '/getEstadosMesas',
  controller.getEstadosMesas
)

module.exports = router