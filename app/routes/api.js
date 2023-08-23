const express = require('express')

const controller = require('../controllers/oftalmogestion')

const router = express.Router()




const path = '/v2'

/**
 * Ruta: /user GET
 */
router.post(
    path+`/getLoginUser`,
    controller.getLoginUser
)
router.get(
    path+`/getLatestHC`,
    controller.getLatestHC
)
router.post(
    path+`/getDataIDDoctorAppointments`,
    controller.getDataIDDoctorAppointments
)
router.get(
    path+`/getDoctors`,
    controller.getDoctors
)
router.get(
    path+`/getBenefits`,
    controller.getBenefits
)
router.get( 
    path+`/getSocieties`,
    controller.getSocieties
)
router.get(
    path+`/getStatusIDAppointment`,
    controller.getStatusIDAppointment
)
router.get(
    path+`/getNumberTicket`,
    controller.getNumberTicket
)

//GESTOR DE FILAS v2.0
router.get( //GET ONLY
    path+`/getNumberNow`,
    controller.getNumberNow
)
//CITA ONLINE
router.get(
    path+`/getSearchPatients`,
    controller.getSearchPatients
)
router.get(
    path+`/getPatientLastDoctor`,
    controller.getPatientLastDoctor
)
router.get(
    path+`/getDataPatient`,
    controller.getDataPatient
)
router.get(
    path+`/getSearchScheduleDoctorAvailable`,
    controller.getSearchScheduleDoctorAvailable
)
router.get(
    path+`/getSearchScheduleIdDoctorAvailable`,
    controller.getSearchScheduleIdDoctorAvailable
)
router.post(
    path+`/postCreateNewPatient`,
    controller.postCreateNewPatient
)
router.post(
    path+`/postDeleteAppointment`,
    controller.postDeleteAppointment
)


 
module.exports = router