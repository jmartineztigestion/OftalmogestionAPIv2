const mysql = require('mysql')

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
  var connectionOftalmogestion = mysql.createConnection({
    host     : '195.55.82.26',
    port: 14330,
    user     : 'root',
    password : 'mm12jn',
    database : 'oftalmogestion_2_ioa'
  });
 /* OT
     var connectionOftalmogestion = mysql.createConnection({
    host     : '195.55.82.25',
    port: 30004,
    user     : 'root',
    password : 'mm12jn',
    database : 'oftalmogestion_2_molina'
  });*/
  /* LOCAL
  var connectionOftalmogestion = mysql.createConnection({
    host     : '127.0.0.1',
    port: 3306,
    user     : 'root',
    password : 'mm12jn',
    database : 'oftalmogestion_2_molina'
  });*/
  connectionOftalmogestion.connect(error =>{
    if(error){
    console.log("Error Miranza IOA DB")
      }else{
    console.log("Conectado Miranza IOA DB")
  
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
exports.getDoctors = (req, res) => {
  var data = req.body;
  
  try {
    try{
     
        let sql = `SELECT
        td_usuario.us_idUsuario,
        td_usuario.us_nombre,
        td_usuario.us_ag_alias,
        td_usuario.us_numeroColegiado
        FROM
        td_usuario
        WHERE us_agenda = 1 AND us_activo = 1 AND us_tipo_sala = 'Médicos' AND chivato_eliminar=0 `;
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
exports.getBenefits = (req, res) => {
  var data = req.body;
  
  try {
    try{ 
     
        let sql = `SELECT
        tp_idTarifaPrestacion, 
        tp_titulo
        FROM
        td_tarifa_prestacion
        WHERE chivato_eliminar = 0`;
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
exports.getSocieties = (req, res) => {
  var data = req.body;
  
  try {
    try{
     
        let sql = `SELECT
        so_idSociedad, 
        so_nombre
      FROM
        td_sociedad
        WHERE chivato_eliminar = 0`;
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