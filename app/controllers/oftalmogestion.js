const mysql = require('mysql')
const moment = require('moment')
moment.locale('es');
//NUBE
var connectionIngesta = mysql.createConnection({
    host     : 'mysql-5603.dinaserver.com',
    port: 3306,
    user     : 'INGESTA',
    password : 'iNGeSTa2023*',
    database : 'bd_ingesta'
  });
  connectionIngesta.connect(error =>{
    if(error){
    console.log("Error Ingesta DB")
      }else{
    console.log("Conectado INGESTA DB")
  
  }
  });

//LOCAL 
  /* var connectionOftalmogestion = mysql.createConnection({
    host     : '195.55.82.26',
    port: 14330,
    user     : 'root',
    password : 'mm12jn',
    database : 'oftalmogestion_2_ioa'
  });
 */
   /*  var connectionOftalmogestion = mysql.createConnection({
    host     : '195.55.82.25',
    port: 30004,
    user     : 'root',
    password : 'mm12jn',
    database : 'oftalmogestion_2_molina'
  });
   LOCAL*/
   var connectionOftalmogestion = mysql.createConnection({
    host     : '127.0.0.1',
    port: 3306,
    user     : 'root',
    password : 'mm12jn',
    database : 'oftalmogestion_2_begitek'
  });
  connectionOftalmogestion.connect(error =>{
    if(error){
    console.log("Error Miranza OT DB")
      }else{
    console.log("Conectado Miranza OT DB")
  
  }
  });


exports.getDataIDDoctorAppointments = (req, res) => {
    var data = req.body;
    try {
      try{
        if(data.id_doctor > 0){
          let sql = `
          SELECT
        td_agenda_envision.hora_inicio as id, 
        CONCAT(td_paciente.pa_nombre, " ", td_paciente.pa_apellido1) as title,        
	CASE WHEN td_agenda_envision.estado LIKE '%EN PROCESO%' THEN 'EN PROCESO' 
	WHEN td_agenda_envision.estado LIKE '%EN ESPERA%' THEN 'EN ESPERA' ELSE 			td_agenda_envision.estado END as status,
	'documentation' as label, 
	td_agenda_envision.prestacion as benefit
     FROM
        td_agenda_envision
        INNER JOIN
        td_paciente
        ON  
          td_agenda_envision.id_paciente = td_paciente.pa_idPaciente
        INNER JOIN
        td_usuario
        ON 
          td_agenda_envision.id_usuario = td_usuario.us_idUsuario
        INNER JOIN
        td_tarifa_prestacion
        ON 
          td_agenda_envision.id_prestacion = td_tarifa_prestacion.tp_idTarifaPrestacion 
              WHERE td_agenda_envision.id_usuario = `+mysql.escape(data.id_doctor)+`
		AND td_agenda_envision.fecha = `+mysql.escape(data.date_now)+`
              AND td_agenda_envision.chivato_eliminacion = '0'
              ORDER BY td_agenda_envision.hora_inicio ASC`;
                connectionOftalmogestion.query(sql, function (error, results, fields) {
            if(error) throw error;
              if(results.length > 0){
                  //console.log(results)
                res.json(results)
              }else{
                res.send('No results');
              }
            });
        }else{
          res.send('id_appintment value not found');
        }
      } catch (error) {
        console.error( error);
      }
      //return res.send();
    } catch (err) {
      return res.sendStatus(401);
    }
}
exports.getLoginUser = (req, res) => {
    var data = req.body;
  console.log(data)
  try {
    try{
      if(data){
        let sql = `SELECT
        td_usuario.us_idUsuario,
        td_usuario.us_nombre,
        td_usuario.us_ag_alias,
        td_usuario.us_nombre_largo,
        td_usuario.us_numeroColegiado
        FROM
        td_usuario
        WHERE us_agenda = 1 AND us_activo = 1 AND us_tipo_sala = 'Médicos' AND chivato_eliminar=0
        AND 
        td_usuario.us_usuario = `+mysql.escape(data.username)+` AND
        td_usuario.us_clave = `+mysql.escape(data.password)+`  `;
        connectionOftalmogestion.query(sql, function (error, results, fields) {
          if(error) throw error;
            if(results.length > 0){
              res.json(results)
            }else{
              res.send('No results');
            }
          });
      }else{
        res.send('user value not found');
      }
    } catch (error) {
      console.error( error);
    }
    //return res.send();
  } catch (err) {
    return res.sendStatus(401);
  }
}

exports.getLatestHC = (req, res) => {
  var data = req.body;
  
  try {
    try{
     
        let sql = `SELECT MAX(pa_hClinica+1) AS pa_hClinica FROM td_paciente`;
          connectionOftalmogestion.query(sql, function (error, results, fields) {
          if(error) throw error;
            if(results.length > 0){
              res.json(results)
            }else{
              res.send('No results');
            }
          });
      
    } catch (error) {
      console.error( error);
    }
    //return res.send();
  } catch (err) {
    return res.sendStatus(401);
  }
}

exports.getNumberNow = (req, res) => {
  var data = req.body;
  var date = new Date()
  var day = `${(date.getDate())}`.padStart(2,'0');
  var month = `${(date.getMonth()+1)}`.padStart(2,'0');
  var year = date.getFullYear();
  
  
  try {
    try{
        
        let sql = `SELECT
        td_tiempo_espera.ts_estado, 
        td_tiempo_espera.ts_accion, 
        td_paciente.pa_ticket, 
        td_tiempo_espera.ts_id_paciente,
        td_tiempo_espera.ts_fecha_tiempo
      FROM
        td_tiempo_espera
        INNER JOIN
        td_paciente
        ON 
          td_tiempo_espera.ts_id_paciente = td_paciente.pa_idPaciente
      WHERE
        td_tiempo_espera.ts_estado LIKE '%EN PROCESO%' AND td_paciente.pa_ticket IS NOT NULL AND ts_fecha = `+mysql.escape(day+"-"+month+"-"+year)+`
      ORDER BY
        td_tiempo_espera.ts_id DESC
      LIMIT 8`;
          connectionOftalmogestion.query(sql, function (error, results, fields) {
          if(error) throw error;
            if(results.length > 0){
              res.json(results)
            }else{
              res.send('No results');
            }
          });
      
    } catch (error) {
      console.error( error);
    }
  } catch (err) {
    return res.sendStatus(401);
  }
}

exports.getStatusIDAppointment = (req, res) => {
  var data = req.body;
  
  try {
    try{
      if(data.id_visita.length > 0){
        let sql = `SELECT 
                td_tiempo_espera.ts_estado,
                td_tiempo_espera.ts_accion
                FROM
                td_tiempo_espera
                WHERE td_tiempo_espera.ts_id_cita = `+mysql.escape(data.id_visita)+`
                ORDER BY ts_id DESC LIMIT 1  `;
          connectionOftalmogestion.query(sql, function (error, results, fields) {
          if(error) throw error;
            if(results.length > 0){
              res.json(results)
            }else{
              res.send('No results');
            }
          });
      }else{
        res.send('id_appintment value not found');
      }
    } catch (error) {
      console.error( error);
    }
    //return res.send();
  } catch (err) {
    return res.sendStatus(401);
  }
}
exports.getNumberTicket = (req, res) => {
  var data = req.body;
  
  try {
    try{
      if(data.id_dni.length > 0){
        let sql = `SELECT 
        td_paciente.pa_idPaciente,
        td_paciente.pa_nombre, 
        td_paciente.pa_apellido1, 
        td_paciente.pa_dni,
        td_paciente.pa_email,	
        td_paciente.pa_hClinica,
        td_paciente.pa_ubicacion, 
        td_paciente.pa_tipo_documento,
        td_agenda_envision.tipo,
        date_format(td_agenda_envision.fecha, "%Y-%m-%d") as fecha,
        td_agenda_envision.prestacion,
        td_agenda_envision.hora_inicio,
        td_agenda_envision.azul,
        td_agenda_envision.id,
        td_paciente.pa_movil,
        td_paciente.pa_poblacion,
        td_paciente.pa_codigoPostal,
        td_paciente.pa_domicilio,
        td_paciente.pa_telefono,
        td_agenda_envision.estado
        FROM
        td_agenda_envision
        INNER JOIN
        td_paciente
        ON 
        td_agenda_envision.id_paciente = td_paciente.pa_idPaciente  
        WHERE td_paciente.pa_dni = `+mysql.escape(data.id_dni)+`
              AND td_agenda_envision.chivato_eliminacion = '0'
              ORDER BY fecha DESC LIMIT 1  `;
          connectionOftalmogestion.query(sql, function (error, results, fields) {
          if(error) throw error;
            if(results.length > 0){
              res.json(results)
            }else{
              res.send('No results');
            }
          });
      }else{
        res.send('id_appintment value not found');
      }
    } catch (error) {
      console.error( error);
    }
    //return res.send();
  } catch (err) {
    return res.sendStatus(401);
  }
}



//CITA ONLINE
exports.getSocieties = (req, res) => {
  var data = req.body;
  let centro = "";
  try {
    try{
      if(data.id_center != null){
        if(data.id_center == 10){//María de Molina 
           centro = "MARIA DE MOLINA";
        }
        if(data.id_center == 11){//Moratalaz
           centro = "MORATALAZ";
        }
        let sql = `SELECT
        so_idSociedad as id_society, 
        so_nombre as name_society
        FROM
        td_sociedad
        WHERE chivato_eliminar = 0 AND ubicacion = `+mysql.escape(centro)+``;
          connectionOftalmogestion.query(sql, function (error, results, fields) {
          if(error) throw error;
            if(results.length > 0){
              res.json(results)
            }else{
              res.send('No results');
            }
          });
      }else{
        res.send('No results');
      }
    } catch (error) {
      console.error( error);
    }
  } catch (err) {
    return res.sendStatus(401);
  }
}
exports.getBenefits = (req, res) => {
  var data = req.body;
  let centro = "";
  try {
    try{
      if(data.id_center != null){
        if(data.id_center == 10){//María de Molina 
           centro = "MARIA DE MOLINA";
        }
        if(data.id_center == 11){//Moratalaz
           centro = "MORATALAZ";
        }
        let sql = `SELECT DISTINCT
        td_tarifa_prestacion.tp_idTarifaPrestacion as id_benefit, 
        td_tarifa_prestacion.tp_titulo as name_benefit
        FROM
          td_tarifa_prestacion
        WHERE
          td_tarifa_prestacion.ubicacion = `+mysql.escape(centro)+`
        ORDER BY td_tarifa_prestacion.tp_idTarifaPrestacion ASC`;
          connectionOftalmogestion.query(sql, function (error, results, fields) {
          if(error) throw error;
            if(results.length > 0){
              res.json(results)
            }else{
              res.send('No results');
            }
          });
      }else{
        res.send('No results');
      }
    } catch (error) {
      console.error( error);
    }
  } catch (err) {
    return res.sendStatus(401);
  }
}
exports.getDoctors = (req, res) => {
  var data = req.body;
  let centro = "";
  try {
    try{
      if(data.id_center != null){
        if(data.id_center == "10"){//María de Molina 
           centro = "MARIA DE MOLINA";
        }
        if(data.id_center == "11"){//Moratalaz
           centro = "MORATALAZ";
        }
        let sql = `SELECT
        td_usuario.us_idUsuario AS id_doctor,
        td_usuario.us_nombre AS name_doctor,
        td_usuario.us_nombre_largo AS name_long_doctor,
        td_usuario.us_ag_alias AS alias_doctor 
      FROM
        td_usuario 
      WHERE
        us_agenda = 1 
        AND us_activo = 1 
        AND us_tipo_sala = 'Médicos' 
        AND us_nombre != 'OPTOMETRISTA' 
        AND us_nombre != 'OPTOMETRISTAS' 
        AND us_nombre != 'AT PACIENTE' 
        AND us_ag_alias != 'OPTOMETRISTAS' 
        AND us_ag_alias != 'AT PACIENTE' 
        AND chivato_eliminar = 0 
        AND ubicacion = `+mysql.escape(centro)+`
        ORDER BY us_idUsuario ASC`;
        console.log(sql)

          connectionOftalmogestion.query(sql, function (error, results, fields) {
          if(error) throw error;
            if(results.length > 0){
              res.json(results)
            }else{
              res.send('No results');
            }
          });
      }else{
        res.send('No results');
      }
        
          
      
    } catch (error) {
      console.error( error);
    }
    //return res.send();
  } catch (err) {
    return res.sendStatus(401);
  }
}
exports.getSearchPatients = (req, res) => {
  var data = req.body;
  let centro = "";
  try {
    try{
      if(data.id_center != null && data.identification != null && data.birthday_date != null){
        if(data.id_center == "10"){//María de Molina 
           centro = "MARIA DE MOLINA";
        }
        if(data.id_center == "11"){//Moratalaz
           centro = "MORATALAZ";
        }
        let sql = `SELECT
        td_paciente.pa_idPaciente as id_patient, 
        td_paciente.pa_hClinica as num_hc, 
        td_paciente.pa_nombre as name_patient, 
        td_paciente.pa_apellido1 as surnames_patient
      FROM
        td_paciente
        WHERE pa_dni LIKE `+mysql.escape("%"+data.identification+"%")+` AND pa_fechaNacimiento = `+mysql.escape(data.birthday_date)+`
        AND pa_ubicacion = `+mysql.escape(centro)+``;
        console.log(sql)

          connectionOftalmogestion.query(sql, function (error, results, fields) {
          if(error) throw error;
            if(results.length > 0){
              res.json(results)
            }else{
              res.send('No results');
            }
          });
      }else{
        res.send('No results');
      }
        
          
      
    } catch (error) {
      console.error( error);
    }
    //return res.send();
  } catch (err) {
    return res.sendStatus(401);
  }
}
exports.getPatientLastDoctor = (req, res) => {
  var data = req.body;
  let centro = "";
  try {
    try{
      if(data.id_center != null && data.num_hc != null ){
        if(data.id_center == "10"){//María de Molina 
           centro = "MARIA DE MOLINA";
        }
        if(data.id_center == "11"){//Moratalaz
           centro = "MORATALAZ";
        }
        let sql = `SELECT
        td_agenda_envision.id_paciente as id_patient, 
        td_agenda_envision.id_usuario as id_doctor, 
        td_agenda_envision.hora_inicio as last_hour, 
        DATE_FORMAT(td_agenda_envision.fecha, "%Y-%m-%d") as last_date
      FROM
        td_agenda_envision
      WHERE
        td_agenda_envision.hc = `+mysql.escape(data.num_hc)+` AND td_agenda_envision.ubicacion = `+mysql.escape(centro)+` AND td_agenda_envision.estado = 'REALIZADO' AND td_agenda_envision.chivato_eliminacion = 0
        ORDER BY last_date DESC LIMIT 1
        `;
        console.log(sql)

          connectionOftalmogestion.query(sql, function (error, results, fields) {
          if(error) throw error;
            if(results.length > 0){
              res.json(results)
            }else{
              res.send('No results');
            }
          });
      }else{
        res.send('No results');
      }
        
          
      
    } catch (error) {
      console.error( error);
    }
    //return res.send();
  } catch (err) {
    return res.sendStatus(401);
  }
}
//PHONE
exports.getDataPatient = (req, res) => {
  var data = req.body;
  var date = new Date()
  var day = `${(date.getDate())}`.padStart(2,'0');
  var month = `${(date.getMonth()+1)}`.padStart(2,'0');
  var year = date.getFullYear();
  try {
    try{
      if(data.num_phone > 0){
        let sql = `SELECT
        td_paciente.pa_hClinica AS num_hc, 
        td_paciente.pa_nombre AS name_patient, 
        td_paciente.pa_apellido1 AS surnames_patient, 	
        td_paciente.pa_dni AS identification, 
        td_paciente.pa_telefono AS num_phone_landline, 
        td_paciente.pa_movil AS num_phone_mobile, 
        td_paciente.pa_fechaNacimiento AS birthday_date, 
        CASE
          WHEN td_sociedad.so_nombre = 'PRIVADO' THEN
          'Privado' 
          WHEN td_sociedad.so_nombre != 'PRIVADO' THEN
          'Mutua'           
          ELSE ''
        END AS type_society,
        CASE
          WHEN td_paciente.pa_lopd_si = '1' THEN
          'Sí' 
          WHEN td_paciente.pa_lopd_si = '0' THEN
          'No' 
        END AS signed_lopd,
        td_paciente.pa_domicilio as residence, 
        td_paciente.pa_poblacion as municipality, 
        td_paciente.pa_provincia as province, 
        td_paciente.pa_pais as country, 
        td_paciente.pa_codigoPostal as postal_code,
        td_idioma.id as id_language,
        td_idioma.idioma as lenguage,
        CASE
          WHEN td_paciente.pa_ubicacion = 'MARIA DE MOLINA' THEN
          '10' 
          WHEN td_paciente.pa_ubicacion = 'MORATALAZ' THEN
          '11' 
        END AS id_center,
        td_paciente.pa_ubicacion as name_center,
        '' AS status_operating,
      '' AS date_operating
      FROM
        td_paciente
        LEFT JOIN
        td_idioma
        ON 
          td_paciente.pa_id_idioma = td_idioma.id
        LEFT JOIN
        td_sociedad
        ON 
          td_paciente.pa_so_idSociedad = td_sociedad.so_idSociedad
        WHERE (td_paciente.pa_telefono LIKE `+mysql.escape("%"+data.num_phone+"%")+` OR td_paciente.pa_movil LIKE `+mysql.escape("%"+data.num_phone+"%")+`) AND td_paciente.pa_eliminar IS NULL
        ORDER BY td_paciente.pa_idPaciente ASC LIMIT 1`;
        connectionOftalmogestion.query(sql, function (error, results, fields) {
          if(error) throw error;
            if(results.length > 0){
              var dataDoble = results;
              let sqlDoble = `SELECT
              CASE
                WHEN td_agenda_envision.tipo = 'QUIRÓFANO' AND td_agenda_envision.estado = 'SIN ASISTIR' AND td_agenda_envision.chivato_eliminacion = '0' THEN 'SIN ASISTIR'           
                WHEN td_agenda_envision.tipo = 'QUIRÓFANO' AND td_agenda_envision.estado = 'REALIZADO' AND td_agenda_envision.chivato_eliminacion = '0' THEN 'REALIZADO'           
                WHEN td_agenda_envision.tipo = 'QUIRÓFANO' AND td_agenda_envision.estado = 'FACTURADA' AND td_agenda_envision.chivato_eliminacion = '0' THEN 'FACTURADA'          
                END AS status_operating,
              CASE
              WHEN td_agenda_envision.tipo = 'QUIRÓFANO' AND td_agenda_envision.estado = 'SIN ASISTIR' AND td_agenda_envision.chivato_eliminacion = '0' THEN DATE_FORMAT(td_agenda_envision.fecha, "%Y-%m-%d")            
              WHEN td_agenda_envision.tipo = 'QUIRÓFANO' AND td_agenda_envision.estado = 'REALIZADO' AND td_agenda_envision.chivato_eliminacion = '0' THEN DATE_FORMAT(td_agenda_envision.fecha, "%Y-%m-%d")           
              WHEN td_agenda_envision.tipo = 'QUIRÓFANO' AND td_agenda_envision.estado = 'FACTURADA' AND td_agenda_envision.chivato_eliminacion = '0' THEN DATE_FORMAT(td_agenda_envision.fecha, "%Y-%m-%d")           
              END AS date_operating
            FROM
                td_agenda_envision
              WHERE td_agenda_envision.tipo = 'QUIRÓFANO' AND td_agenda_envision.fecha >= `+mysql.escape(year+"-"+month+"-"+day)+` AND td_agenda_envision.chivato_eliminacion = '0' AND td_agenda_envision.hc = `+mysql.escape(dataDoble[0].num_hc)+` 
              ORDER BY td_agenda_envision.id ASC LIMIT 1`;
                    connectionOftalmogestion.query(sqlDoble, function (error, results, fields) {
                      if(results.length > 0){

                        if(results[0].status_operating.length > 0 && results[0].date_operating.length > 0){
                          dataDoble[0]['status_operating']=results[0].status_operating;
                          dataDoble[0]['date_operating']=results[0].date_operating;
                          res.json(dataDoble)
                        }else{
                          res.json(dataDoble)

                        }
                      }else{
                        res.json(dataDoble)
                      }
                     


                    });
            }else{
              res.send('No results');
            }
          });
      }else{
        res.send('num_phone value not found');
      }
    } catch (error) {
      console.error( error);
    }
    //return res.send();
  } catch (err) {
    return res.sendStatus(401);
  }
}
exports.getSearchScheduleDoctorAvailable = (req, res) => {
  var data = req.body;
  let centro = "";
  try {
    try{
      if(data.id_center != null && data.num_hc != null ){
        if(data.id_center == "10"){//María de Molina 
           centro = "MARIA DE MOLINA";
        }
        if(data.id_center == "11"){//Moratalaz
           centro = "MORATALAZ";
        }
        let sql = `SELECT
        td_agenda_envision.id_paciente as id_patient, 
        td_agenda_envision.id_usuario as id_doctor, 
        td_agenda_envision.hora_inicio as last_hour, 
        td_agenda_envision.fecha as last_date
      FROM
        td_agenda_envision
      WHERE
        td_agenda_envision.hc = `+mysql.escape(data.num_hc)+` AND td_agenda_envision.ubicacion = `+mysql.escape(centro)+` AND td_agenda_envision.estado = 'REALIZADO' AND td_agenda_envision.chivato_eliminacion = 0
        ORDER BY td_agenda_envision.id DESC LIMIT 1
        `;
        console.log(sql)

          connectionOftalmogestion.query(sql, function (error, results, fields) {
          if(error) throw error;
            if(results.length > 0){
              res.json(results)
            }else{
              res.send('No results');
            }
          });
      }else{
        res.send('No results');
      }
        
          
      
    } catch (error) {
      console.error( error);
    }
    //return res.send();
  } catch (err) {
    return res.sendStatus(401);
  }
}
exports.getSearchScheduleIdDoctorAvailable =  (req, res) => {
  var data = req.body;

    let centro = "";
    var AVA_START_TIME = '9:00';
    var AVA_END_TIME  = '11:30';
    var clinica = "";
    var num_solts = 1;
    var num_slots_busy = 2;
    var fecha_aux = "";
    var last_solt = "";
    var off_set_slot = 8;
    var date_appointment = "";
    //GLOBAL VARIABLE
    let id_doctor = data.id_doctor;
    let id_benefit = data.id_benefit;
    let id_society = data.id_society;
    if(data.date_appointment){
      date_appointment = moment(data.date_appointment).format('YYYY-MM-DD');
      date_appointment_day = moment(data.date_appointment).format('dddd');

    }
    console.log(date_appointment_day)
    //OBJECTS
    var results_doctor;
    var results_benefit;
    var results_society;
    var sql_hours_busy;
    var results_hours_doctor;
    var tramo_horarios = [];
    var tramo_horarios_usado = [];

  try {
    try{
     
      if(date_appointment.length > 0){
        //SACAR TODOS LOS MEDICOS
        //SACAR HORARIO
        //SI ENVIA ID DOCTOR
        if(id_doctor.length > 0 && date_appointment.length > 0){
          if(data.id_center == "10"){//María de Molina 
            centro = "MARIA DE MOLINA";
          }
          if(data.id_center == "11"){//Moratalaz
            centro = "MORATALAZ";
          }
          //DOCTOR
          let sqlIdDoctor = `SELECT us_idUsuario, us_nombre_largo
          FROM td_usuario 
          WHERE us_agenda='1' 
          AND us_tipo_sala='Médicos' 
          AND us_idUsuario=`+mysql.escape(id_doctor)+``;
          connectionOftalmogestion.query(sqlIdDoctor, function (error, results, fields) {
            //RESULTADO DE DOCTOR
            results_doctor = results;
            if(error) throw error;
            if(results_doctor.length > 0){
              //PRESTACIONES 
              let sqlBenefits = `SELECT
              td_tarifa_prestacion.tp_idTarifaPrestacion,
              td_tarifa_prestacion.tp_titulo 
              FROM
              td_tarifa_prestacion 
              WHERE
              td_tarifa_prestacion.chivato_eliminar = '0'
              AND td_tarifa_prestacion.tp_idTarifaPrestacion=`+mysql.escape(id_benefit)+``;
              connectionOftalmogestion.query(sqlBenefits, function (error, results, fields) {
                results_benefit = results;
                if(error) throw error;
                if(results_benefit.length > 0){
                  //SOCIEDADES
                  let sqlSocieties = `SELECT 
                  so_idSociedad,
                  so_nombre
                  FROM 
                  td_sociedad 
                  WHERE 
                  chivato_eliminar='0' 
                  AND so_idSociedad=`+mysql.escape(id_society)+``;
                  connectionOftalmogestion.query(sqlSocieties, function (error, results, fields) {
                    results_society = results;
                    console.log(results_society)
                    if(error) throw error;
                    if(results_society.length > 0){
                      let fecha_inicio = new Date(date_appointment);
                      let fecha_final = new Date(date_appointment);
                      fecha_final.setDate(fecha_inicio.getDate() + 7);
                      //let diferencia = fecha_final - fecha_inicio;
                      var fechaInicio = new Date(date_appointment).getTime();
                      var fechaFin    = new Date(date_appointment).getTime();
                      console.log(fechaInicio)
                      var diff = fechaFin - fechaInicio;
                      var diferencia = diff/(1000*60*60*24)


                      for (let i = 0; i <= diferencia; i++) {

                        let paso = true;
                        let fecha = new Date(fecha_inicio.setDate(fecha_inicio.getDate() + i));
                        fecha_aux = fecha.toISOString().split("T")[0];
                        //FESTIVOS TODOS
                        let sqlHolidaysAll = `SELECT fs_fecha 
                        FROM td_festivo 
                        WHERE fs_fecha = `+mysql.escape(fecha_aux)+` and fs_ag_usuario is null`;
                        connectionOftalmogestion.query(sqlHolidaysAll, function (error, results, fields) {
                        var results_holidays_all = results;
                        if(error) throw error;
                        if(!error){
                              if (results_holidays_all) {
                                paso = false;
                              }
                          }else{

                          }
                        });

                        //FESTIVOS DOCTOR
                        let sqlHolidaysDoctor = `SELECT 
                        fs_fecha 
                        FROM td_festivo 
                        WHERE fs_fecha=`+mysql.escape(fecha_aux)+` AND fs_ag_usuario=`+mysql.escape(id_doctor)+``;
                        connectionOftalmogestion.query(sqlHolidaysDoctor, function (error, results, fields) {
                        var results_holidays_doctor = results;
                        if(error) throw error;
                        if(!error){
                              if (results_holidays_doctor) {
                                paso = false;
                              }
                          }else{

                          }
                        });
                      
                        //FESTIVOS CLINICA
                        let sqlHolidaysCenter = `SELECT 
                        op_nom_clinica, 
                        op_nom_clinica2, 
                        op_nom_clinica3, 
                        cargar_iconos_calendario, 
                        latepoint, 
                        private_key, 
                        public_key, 
                        pass_pharse, 
                        sede 
                        FROM td_opciones`;
                        connectionOftalmogestion.query(sqlHolidaysCenter, function (error, results, fields) {
                          var results_holidays_center = results;
                          if(error) throw error;
                          if(!error){
                            if (results_holidays_center) {
                              clinica = results[0].op_nom_clinica2;
                            }
                          }else{
  
                          }
                        });


                        if (paso === true) {
                            let nom_dia = "";
                            nom_dia = fecha.toLocaleDateString("es-ES", { weekday: "long" });
                            console.log("DIA MON: "+nom_dia)
                            let sql = "";
                            let value_hour_especial = null;

                            let sqlHourSpecial = `SELECT * 
                            FROM 
                            td_horario 
                            WHERE ho_fechaInicio=`+mysql.escape(fecha_aux)+` 
                            AND ho_dias = `+mysql.escape(id_doctor)+` 
                            AND ho_especial = '1' 
                            AND ho_tipo = 'CONSULTA' 
                            AND ho_us_idUsuario = `+mysql.escape(id_doctor)+``; // SI NO TIENE HORARIO
                            connectionOftalmogestion.query(sqlHourSpecial, function (error, results, fields) {
                              var results_hours_special = results;
                              if(error) throw error;
                              if(!error){
                                if (results_hours_special > 0) {
                                  value_hour_especial = results_hours_special

                                } else {
                                    let sqlHourSpecialDoctor = `SELECT ho_horaInicio, ho_horaFin, ho_intervalo
                                    FROM td_horario 
                                    where `+mysql.escape(fecha_aux)+` between ho_fechaInicio 
                                    AND ho_fechaFin 
                                    AND ho_tipo='CONSULTA'
                                    AND ho_especial = '1' 
                                    AND ho_dias=`+mysql.escape(nom_dia)+` 
                                    AND ho_us_idUsuario=`+mysql.escape(id_doctor)+``;

                                    connectionOftalmogestion.query(sqlHourSpecialDoctor, function (error, results, fields) {
                                      var results_hours_special_doctor = results;
                                      if(error) throw error;
                                      if(!error){

                                        if(results_hours_special_doctor) {  
                                          num_slots = 0;                                        
                                          for (j = 0; j < results_hours_special_doctor.length; j++) {

                                            hora_inicio = results_hours_special_doctor[j].ho_horaInicio;
                                            hora_fin = results_hours_special_doctor[j].ho_horaFin;
                                            intervalo = results_hours_special_doctor[j].ho_intervalo;
                              
                                            if (AVA_START_TIME < hora_inicio && AVA_END_TIME < hora_inicio) {
                                              break;
                                            } else if (AVA_START_TIME > hora_fin && AVA_END_TIME > hora_fin) {
                                              break;
                                            } else if (AVA_START_TIME < hora_inicio && AVA_END_TIME > hora_fin) {
                                              // Do something
                                            } else if (AVA_START_TIME >= hora_inicio && AVA_END_TIME > hora_fin) {
                                              try {
                                                AVA_START_TIME = (AVA_START_TIME);
                                              } catch (ex) {
                                                // Handle error
                                              }
                              
                                              hora_inicio = AVA_START_TIME;
                                            } else if (AVA_START_TIME <= hora_inicio && AVA_END_TIME <= hora_fin) {
                                              hora_fin = AVA_END_TIME;
                                            } else {
                                              // hora_inicio = AVA_START_TIME;
                                              // hora_fin = AVA_END_TIME;
                                            }

                                            var hora_inicio_comparative = moment(hora_inicio,"HH:mm").format("HH:mm");
                                            var hora_fin_comparative = moment(hora_fin,"HH:mm").format("HH:mm");
                                            console.log("INICIO:"+hora_inicio_comparative);
                                            console.log("FIN:"+hora_fin_comparative);

                                            while (hora_inicio_comparative <= hora_fin_comparative) {

                                                    if (clinica === "OPHTHALTEAM") {
                                                      var hora_inicio_aux_mañana = moment("13:00", 'HH:mm');
                                                      var hora_fin_aux_mañana = moment("13:30", 'HH:mm');
                                                      var hora_inicio_aux_tarde = moment("18:30", 'HH:mm').format('HH:mm');
                                                      var hora_fin_aux_tarde = moment("19:00", 'HH:mm').format('HH:mm');
                  
                                                      if (clinica === "MORATALAZ") {
                                                          hora_inicio_aux_tarde = moment("19:00", 'HH:mm');
                                                          hora_fin_aux_tarde = moment("19:30", 'HH:mm');
                                                          var hor_moratalaz = moment(hora_inicio_comparative, 'HH:mm').format('HH:mm');
                  
                                                          try {
                                                              if (
                                                                  hor_moratalaz.includes("13:0") || hor_moratalaz.includes("13:1") || hor_moratalaz.includes("13:2") ||
                                                                  hor_moratalaz.includes("13:3") || hor_moratalaz.includes("13:4") || hor_moratalaz.includes("13:5") ||
                                                                  hor_moratalaz.includes("19:0") || hor_moratalaz.includes("19:1") || hor_moratalaz.includes("19:2") ||
                                                                  hor_moratalaz.includes("19:3") || hor_moratalaz.includes("19:4") || hor_moratalaz.includes("19:5")
                                                              ) {
                                                                hora_inicio_comparative = moment(hora_inicio_comparative, "HH:mm").add(intervalo, 'minutes').format("HH:mm");
                                                              } else {
                                                                  tramo_horarios.push(hora_inicio_comparative);
                                                                  hora_inicio_comparative = moment(hora_inicio_comparative, "HH:mm").add(intervalo, 'minutes').format("HH:mm");
                                                              }
                                                          } catch (ex) {
                  
                                                          }
                                                      } else {
                                                          var hor_moratalaz = moment(hora_inicio_comparative,"HH:mm").format('HH:mm');
                  
                                                          try {
                                                              if (
                                                                  hor_moratalaz.includes("13:0") || hor_moratalaz.includes("13:1") || hor_moratalaz.includes("13:2") ||
                                                                  hor_moratalaz.includes("13:3") || hor_moratalaz.includes("13:4") || hor_moratalaz.includes("13:5") ||
                                                                  hor_moratalaz.includes("18:3") || hor_moratalaz.includes("18:4") || hor_moratalaz.includes("18:5") ||
                                                                  hor_moratalaz.includes("19:0") || hor_moratalaz.includes("19:1") || hor_moratalaz.includes("19:2") ||
                                                                  hor_moratalaz.includes("19:3") || hor_moratalaz.includes("19:4") || hor_moratalaz.includes("19:5")
                                                              ) {
                                                                hora_inicio_comparative = moment(hora_inicio_comparative, "HH:mm").add(intervalo, 'minutes').format("HH:mm");
                                                              } else {
                                                                  tramo_horarios.push(hora_inicio_comparative);
                                                                  hora_inicio_comparative = moment(hora_inicio_comparative, "HH:mm").add(intervalo, 'minutes').format("HH:mm");
                                                              }
                                                          } catch (ex) {
                  
                                                          }
                                                      }
                                                  } else {
                                                      tramo_horarios.push(hora_inicio_comparative);
                                                      hora_inicio_comparative = moment(hora_inicio_comparative, 'HH:mm').add(intervalo, 'minutes').format("HH:mm");
                                                  }
                                            /* hora_inicio_comparative = moment(hora_inicio_comparative,"HH:mm").add(intervalo, 'minutes').format("HH:mm");
                                              tramo_horarios.push(hora_inicio_comparative);
                                              console.log(tramo_horarios)*/

                                              
                                            }
                                            if (j == results_hours_special_doctor.length - 1){
                                              //Esta es la última iteración
                                              for(b = 0; b < tramo_horarios.length; b++){

                                                let sqlHoursBusyId = `select hora_inicio from td_agenda_envision where hora_inicio=`+mysql.escape(tramo_horarios[b])+` and fecha=`+mysql.escape(fecha_aux)+` and id_usuario=`+mysql.escape(id_doctor)+` and chivato_eliminacion=0`;
                                                connectionOftalmogestion.query(sqlHoursBusyId, function (error, results, fields) {
                                                  sql_hours_busy = results;                                                   

                                                  if(error) throw error;
                                                  if(!error){
                                                    if(sql_hours_busy.length > 0){
                                                      
                                                      //console.log(sql_hours_busy[0].hora_inicio)
                                                      // Obtener la posición del elemento que deseas eliminar
                                                      var indice = tramo_horarios.indexOf(moment(sql_hours_busy[0].hora_inicio, "HH:mm").format('HH:mm'));

                                                      // Eliminar el elemento en la posición especificada
                                                      if (indice > -1) {
                                                        tramo_horarios.splice(indice, 1);
                                                      }
                                                      tramo_horarios_usado.push(moment(sql_hours_busy[0].hora_inicio, "HH:mm").format('HH:mm'));

                                                      //console.log(tramo_horarios);
                                                    }
                                                    

                                                    
                                                  }else{

                                                  }
                                                  
                                                });

                                              

                                              }
                                              setTimeout(function(){
                                                /*if(b > off_set_slot){
                                                  var resultado = tramo_horarios.slice(0, off_set_slot).concat(tramo_horarios.slice(-off_set_slot));
                                                  res.json(resultado)
                                                }
                                                else{
                                                  res.json(tramo_horarios)
                                                }*/
                                                res.json(tramo_horarios)

                                              }, 5000);

                                            }

                                          }

                                        }else{


                                        }


                                      
                                      }else{
              
                                      }
                                    });
                                
                                }

                              }else{

      
                              }
                            });
                        }

                      }



                    }else{

                    }
      
      
                  });
                

                }else{

                }


              });
              

            }else{
            
            }
          });





      
        }

        //SI NO ENVIA ID DOCTOR
        if(id_doctor !== undefined || id_doctor !== null && date_appointment.length > 0){          
          let sqlIdDoctor = `SELECT us_idUsuario, us_nombre_largo
          FROM td_usuario 
          WHERE us_agenda='1' 
          AND us_tipo_sala='Médicos' 
         `;
          connectionOftalmogestion.query(sqlIdDoctor, function (error, results, fields) {
            //RESULTADO DE DOCTORES
            results_doctor = Object.values(JSON.parse(JSON.stringify(results)));
            if(error) throw error;
            if(results_doctor.length > 0){
              for(i = 0; results_doctor.length > i; i++){
                let sqlHourDoctor = `SELECT ho_horaInicio, ho_horaFin, ho_intervalo
                                    FROM td_horario 
                                    WHERE `+mysql.escape(date_appointment)+` between ho_fechaInicio 
                                    AND ho_fechaFin 
                                    AND ho_tipo='CONSULTA'
                                    AND ho_dias=`+mysql.escape(date_appointment_day)+`
                                    AND ho_us_idUsuario=`+mysql.escape(results_doctor[i].us_idUsuario)+`
                                    `;

                                    connectionOftalmogestion.query(sqlHourDoctor, function (error, results, fields) {
                                       results_hours_doctor =  Object.values(JSON.parse(JSON.stringify(results)));
                                        if(error) throw error;
                                        if(!error){
                                          if(results_hours_doctor) { 
                                            for(b = 0; results_hours_doctor.length > b; b++){

                                            }
                                            res.send('No insert patient');

                                            
                                          }
                                        }else{
                                          res.send('No insert patient');
                                        }
                                    })
              }

            }else{
              res.send("No results");

            }

          });
        }

      }else{
        res.send('No results');
      }
         
    } catch (error) {
      console.error( error);
    }
  } catch (err) {
    return res.sendStatus(401);
  }
}
exports.postCreateNewPatient = (req, res) => {
  var data = req.body;
  var centro = "";
  var new_num_hc;

  try {
    try{
      if(data.id_center != null && data.name_patient != null 
        && data.first_surname_patient != null && data.second_surname_patient != null 
        && data.birthday_date != null && data.identification != null 
        && data.id_society != null && data.num_phone_mobile != null
        && data.email != null && data.residence != null
        && data.municipality != null && data.province != null
        && data.province != null && data.postal_code != null
        && data.country != null ){
        if(data.id_center == "10"){//María de Molina 
          centro = "MARIA DE MOLINA";
        }
        if(data.id_center == "11"){//Moratalaz
            centro = "MORATALAZ";
        }
          
        //SACAR NUM HISTORIA CLINICA
        let sqlNewHCPatient = `SELECT MAX(td_paciente.pa_hClinica+1) AS new_num_hc FROM td_paciente`;

          connectionOftalmogestion.query(sqlNewHCPatient, function (error, results, fields) {
           new_num_hc = results[0].new_num_hc;
          if(error) throw error;
            if(new_num_hc > 0){
             
              let sqlCreatePatient = `INSERT INTO td_paciente 
              (
                pa_hClinica, 
                pa_so_idSociedad, 
                pa_nombre, 
                pa_apellido1, 
                pa_domicilio, 
                pa_poblacion, 
                pa_provincia, 
                pa_codigoPostal,
                pa_pais,
                pa_movil,
                pa_email,
                pa_fechaNacimiento,
                pa_tipo_documento,
                pa_dni,
                pa_fecha_alta,
                pa_ubicacion
              )
              VALUES (`+mysql.escape(new_num_hc)+`,
                      `+mysql.escape(data.id_society)+`, 
                      `+mysql.escape(data.name_patient)+`,
                      `+mysql.escape(data.first_surname_patient+" "+data.second_surname_patient)+`, 
                      `+mysql.escape(data.residence)+`, 
                      `+mysql.escape(data.municipality)+`, 
                      `+mysql.escape(data.province)+`, 
                      `+mysql.escape(data.postal_code)+`, 
                      `+mysql.escape(data.country)+`, 
                      `+mysql.escape(data.num_phone_mobile)+`, 
                      `+mysql.escape(data.email)+`, 
                      `+mysql.escape(moment(data.birthday_date).format("YYYY-MM-DD"))+`,
                      `+mysql.escape(data.identification)+`, 
                      `+mysql.escape("DNI")+`, 
                      `+mysql.escape(moment().format("DD/MM/YYYY HH:mm:ss"))+`,
                      `+mysql.escape(centro)+`
                      )
              `;
      
                connectionOftalmogestion.query(sqlCreatePatient, function (error, results, fields) {
                if(error) throw error;
                  if(!error){
                    let sqlLastPatient = `SELECT 
                    pa_idPaciente AS id_patient, 
                    pa_hClinica AS num_hc 
                    FROM td_paciente 
                    ORDER BY pa_idPaciente DESC LIMIT 1`;

                    connectionOftalmogestion.query(sqlLastPatient, function (error, results, fields) {
                      if(error) throw error;
                        if(!error){
                          res.json(results)

                        }else{
                          res.send('No insert patient');
                        }
                    });

                  }else{
                    res.send('No insert patient');
                  }
                });


              
            }else{
              res.send('No results');
            }
          });
      }else{
        res.send('No error values post');
      }

    } catch (error) {
      console.error( error);
    }
    //return res.send();
  } catch (err) {
    return res.sendStatus(401);
  }
    
}
exports.postCreateNewAppointment = (req, res) => {
  var data = req.body;
  var centro = "";
  var new_patient = "";
  
  try {
    try{
      if(data.new_patient != null && data.id_patient != null 
        && data.id_center != null && data.id_benefit != null 
        && data.id_society != null && data.name_society != null 
        && data.hour_start != null && data.hour_end != null
        && data.email != null && data.residence != null
        && data.date_appointment  ){
        if(data.id_center == "10"){//María de Molina 
          centro = "MARIA DE MOLINA";
        }
        if(data.id_center == "11"){//Moratalaz
            centro = "MORATALAZ";
        }
        if(data.new_patient == "1"){
          new_patient = 1;
        }else{
          new_patient = 0;
        }
         
              let sqlCreateAppointment = `INSERT INTO td_agenda_envision 
              (
                pa_hClinica, 
                pa_so_idSociedad, 
                pa_nombre, 
                pa_apellido1, 
                pa_domicilio, 
                pa_poblacion, 
                pa_provincia, 
                pa_codigoPostal,
                pa_pais,
                pa_movil,
                pa_email,
                pa_fechaNacimiento,
                pa_tipo_documento,
                pa_dni,
                pa_fecha_alta,
                pa_ubicacion
              )
              VALUES (`+mysql.escape(new_num_hc)+`,
                      `+mysql.escape(data.id_society)+`, 
                      `+mysql.escape(data.name_patient)+`,
                      `+mysql.escape(data.first_surname_patient+" "+data.second_surname_patient)+`, 
                      `+mysql.escape(data.residence)+`, 
                      `+mysql.escape(data.municipality)+`, 
                      `+mysql.escape(data.province)+`, 
                      `+mysql.escape(data.postal_code)+`, 
                      `+mysql.escape(data.country)+`, 
                      `+mysql.escape(data.num_phone_mobile)+`, 
                      `+mysql.escape(data.email)+`, 
                      `+mysql.escape(moment(data.birthday_date).format("YYYY-MM-DD"))+`,
                      `+mysql.escape(data.identification)+`, 
                      `+mysql.escape("DNI")+`, 
                      `+mysql.escape(moment().format("DD/MM/YYYY HH:mm:ss"))+`,
                      `+mysql.escape(centro)+`
                      )
              `;
      
                connectionOftalmogestion.query(sqlCreateAppointment, function (error, results, fields) {
                if(error) throw error;
                  if(!error){
                    let sqlLastPatient = `SELECT 
                    td_agenda_envision.id AS id_appointment, 
                    td_agenda_envision.id_paciente AS id_patient 
                    FROM td_agenda_envision 
                    ORDER BY pa_idPaciente DESC LIMIT 1`;

                    connectionOftalmogestion.query(sqlLastPatient, function (error, results, fields) {
                      if(error) throw error;
                        if(!error){
                          res.json(results)

                        }else{
                          res.sendStatus("Error get id new appoinment");
                        }
                    });

                  }else{
                    res.sendStatus("Error insert new appoinment");
                  }
                });

      }else{
        res.send('Error values post');
      }

    } catch (error) {
      console.error( error);
    }
    //return res.send();
  } catch (err) {
    return res.sendStatus(401);
  }
    
}
exports.postDeleteAppointment = (req, res) => {
  var data = req.body;
  let centro = "";
  try {
    try{
      if(data.id_center != null && data.id_ppointment != null ){
        if(data.id_center == "10"){//María de Molina 
           centro = "MARIA DE MOLINA";
        }
        if(data.id_center == "11"){//Moratalaz
           centro = "MORATALAZ";
        }
        let sql = `DELETE FROM td_agenda_envision WHERE td_agenda_envision.id = `+mysql.escape(data.birthday_date)+``;
        //console.log(sql)

          connectionOftalmogestion.query(sql, function (error, results, fields) {
          if(error) throw error;
            if(results.length > 0){
              res.send("Delete appoinment")
            }else{
              res.send('Error delete appoinment');
            }
          });
      }else{
        res.send('Error values post');
      }
        
          
      
    } catch (error) {
      console.error( error);
    }
    //return res.send();
  } catch (err) {
    return res.sendStatus(401);
  }
}
 