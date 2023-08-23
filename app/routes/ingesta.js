const express = require('express')

const controller = require('../controllers/ingesta')

const router = express.Router()




const path = 'ingesta'

/**
 * Ruta: /user GET
 */
router.post(
    `/getLoginUser`,
    controller.getLoginUser
)
router.get(
    `/getLatestHC`,
    controller.getLatestHC
)
router.post(
    `/getDataIDDoctorAppointments`,
    controller.getDataIDDoctorAppointments
)
router.get(
    `/getDoctors`,
    controller.getDoctors
)
router.get(
    `/getBenefits`,
    controller.getBenefits
)
router.get( 
    `/getSocieties`,
    controller.getSocieties
)
router.get(
    `/getStatusIDAppointment`,
    controller.getStatusIDAppointment
)
router.get(
    `/getNumberTicket`,
    controller.getNumberTicket
)
 
module.exports = router