const express = require('express')
const controller = require('../controllers/offered')
const router = express.Router()

router.get(
  '/cualquirRuta',
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

router.post(
  '/recibirPedido',
  controller.postTest
)

module.exports = router