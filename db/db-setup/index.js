// DATABASE
const { create } = require("../db-creation");
const { dbName } = require("../sequelize/config");
const { usuariosD, platosD, formaPagoD, estadoPedidoD } = require("../data");

(async () => {
  try {
    await create();
    await usuariosD();
    await platosD();
    await estadoPedidoD();
    await formaPagoD();
    console.log(`Base de datos ${dbName} creada.\nDatos ingresados.`);
  } catch (err) {
    throw new Error(err);
  }
})();