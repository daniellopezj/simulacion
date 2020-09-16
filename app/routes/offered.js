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

module.exports = router