const csv = require("csv-parser");
const fs = require("fs");
const getStream = require("get-stream");
const { db } = require("..");
const { dbName } = require("../sequelize/config");

//Traigo archivos csv
const usuariosData = "../data/usuarios.csv";
const platosData = "../data/platos.csv";
const formaPagoData = "../data/forma_pago.csv";
const estadoPedidoData = "../data/estado_pedido.csv";


//Leo los archivos csv
async function leerArchivo(archivoAImportar) {
    const parseStream = csv({ delimiter: "," });
    const data = await getStream.array(
      fs.createReadStream(archivoAImportar).pipe(parseStream)
    );
    return data;
  };


//USUARIOS
async function usuariosD() {    
    try {
        const usuarios = await leerArchivo(usuariosData);
        await db.query(`USE ${dbName}`, { raw: true });
        for (let i = 0; i < usuarios.length; i++) {
            const queryCargarUsuarios = `INSERT INTO usuarios (usuario, nombre_apellido, email, tel, direccion, contrasena, admin)
            VALUES ('${usuarios[i].usuario}',
                    '${usuarios[i].nombre_apellido}',
                    '${usuarios[i].email}',
                    '${usuarios[i].tel}',
                    '${usuarios[i].direccion}',
                    '${usuarios[i].contrasena}',
                    '${usuarios[i].admin}')`;
            await db.query(queryCargarUsuarios, { raw: true });
        };
    } catch(error) {
        console.log(error);
    }
}

//PLATOS
async function platosD() {
    const platos = await leerArchivo(platosData);
    await db.query(`USE ${dbName}`, { raw: true });
    try {                
        for (let i = 0; i < platos.length; i++) {
            //console.log(platos[i].descripcion, platos[i].precio, platos[i].imagen)
            const queryCargarPlatos = `INSERT INTO platos (descripcion, precio, imagen)
            VALUES ('${platos[i].descripcion}',
                    '${platos[i].precio}',
                    '${platos[i].imagen}');`;
            await db.query(queryCargarPlatos, { raw: true });
        };
    } catch(error) {
        console.log(error);
    }
}

//FORMA DE PAGO
async function formaPagoD() {
    const formaPago = await leerArchivo(formaPagoData);
    await db.query(`USE ${dbName}`, { raw: true });
    try {
        for (let i = 0; i < formaPago.length; i++) {
           //console.log(formaPago[i].forma_pago)
            const queryCargarFormaPago = `INSERT INTO forma_pago (forma_pago)
            VALUES ('${formaPago[i].forma_pago}');`;
            await db.query(queryCargarFormaPago, { raw: true });
        };
    } catch(error) {
        console.log(error);
    }
}

//ESTADO DEL PEDIDO
async function estadoPedidoD() {
    const estadoPedido = await leerArchivo(estadoPedidoData);
    await db.query(`USE ${dbName}`, { raw: true });
    try {
        for (let i = 0; i < estadoPedido.length; i++) {
            //console.log(estadoPedido[i].estado_pedido)
            const queryCargarEstadoPedido = `INSERT INTO estado_pedido (estado_pedido)
            VALUES ('${estadoPedido[i].estado_pedido}');`;
            await db.query(queryCargarEstadoPedido, { raw: true });
        };
    } catch(error) {
        console.log(error);
    }
}

module.exports = { usuariosD, platosD, formaPagoD, estadoPedidoD };