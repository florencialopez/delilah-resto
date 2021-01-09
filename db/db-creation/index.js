// DATABASE
const { db } = require("../index");
const { createDb, createTabUsuarios, createTabPlatos, createTabPedidos, createTabDetallePedido, createTabEstadoPedido, createTabFormaPago, createTabPlatosFavoritos } = require("../create-queries");


async function create() {
  await db.query(createDb(), { raw: true });
  await db.query(createTabUsuarios(), { raw: true });
  await db.query(createTabPlatos(), { raw: true });
  await db.query(createTabEstadoPedido(), { raw: true });
  await db.query(createTabFormaPago(), { raw: true });
  await db.query(createTabPedidos(), { raw: true });
  await db.query(createTabDetallePedido(), { raw: true });
}

module.exports = { create };