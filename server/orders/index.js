const { db, dbName } = require("../../db");

//MIDDLEWARES
const validateExistingOrder = (req, res, next) => {
    const idPedido = req.params.idPedido;

    let query = `SELECT * FROM ${dbName}.pedidos WHERE id_pedido = '${idPedido}'`;
    db.query(query, {raw: true, type: db.QueryTypes.SELECT})
    .then((data) => {
        if(data[0] && data[0].id_pedido) {
            next();
        } else {
            res.status(409).json("Pedido inexistente.");
        }
    })
    .catch((error) => {
        res.status(500).json(error);
    })
}

const obligatoryOrderData = (req, res, next) => {
    const {
        id_cliente,
        id_forma_pago,
        productos
    } = req.body;
    if(!id_cliente || !id_forma_pago || !productos) {
        res.status(400).json("Faltan datos obligatorios.");
    } else {
        next();
    }
}



//FUNCTIONS

//GET /orders
const detallePedido = async(id_pedido) => {
    let queryDetalle = `SELECT 
    platos.descripcion,
    platos.imagen,
    detalle_pedido.cantidad,
    detalle_pedido.precio  
       
    FROM ${dbName}.detalle_pedido
    INNER JOIN ${dbName}.platos ON detalle_pedido.id_plato = platos.id_plato
    WHERE detalle_pedido.id_pedido = '${id_pedido}'
        ORDER BY id_pedido DESC`;
    
    const [dbPedidosDetalle] = await db.query( queryDetalle, { raw: true });
    return dbPedidosDetalle;
}

const getOrders = async (req, res) => {
    try {
        await db.query( `USE ${dbName}`, { raw: true });
        let queryPedidos = (req.usuario.admin) ? `SELECT pedidos.id_pedido, pedidos.fecha_hora, pedidos.descripcion, pedidos.precio_total,
        usuarios.usuario, usuarios.nombre_apellido, usuarios.direccion,
        forma_pago.forma_pago,
        estado_pedido.estado_pedido
        FROM pedidos
        INNER JOIN usuarios ON pedidos.id_cliente = usuarios.id_cliente
        INNER JOIN forma_pago ON pedidos.id_forma_pago = forma_pago.id_forma_pago
        INNER JOIN estado_pedido ON pedidos.id_estado = estado_pedido.id_estado_pedido        
        ORDER BY id_pedido DESC`
        :
        `SELECT pedidos.id_pedido, pedidos.fecha_hora, pedidos.descripcion, pedidos.precio_total,
        usuarios.usuario, usuarios.nombre_apellido, usuarios.direccion,
        forma_pago.forma_pago,
        estado_pedido.estado_pedido
        FROM pedidos
        INNER JOIN usuarios ON pedidos.id_cliente = usuarios.id_cliente
        INNER JOIN forma_pago ON pedidos.id_forma_pago = forma_pago.id_forma_pago
        INNER JOIN estado_pedido ON pedidos.id_estado = estado_pedido.id_estado_pedido
        WHERE pedidos.id_cliente = '${req.usuario.id_cliente}'`

        const [dbPedidos] = await db.query( queryPedidos, { raw: true });
        let pedidos = [];
        //recorro los resultados
        for (let i=0; i < dbPedidos.length; i++)
        {
            //Creo una variable para almacenar la orden con su detalle
            let detalle = await detallePedido(dbPedidos[i].id_pedido);
            dbPedidos[i].productos = detalle;
            pedidos.push(dbPedidos[i]);
        }
        res.status(200).json(pedidos);
    }
    catch (error) {
        res.status(500).send(`ERROR: ${error}`);
    }
}

//POST /orders
async function obtenerDescripcionPrecio(productos) {
    let descripcion = "";
    let precio_total = 0;
    for (let i = 0; i < productos.length; i++) {
        let query = `SELECT platos.descripcion, platos.precio
                FROM ${dbName}.platos
                WHERE id_plato = ${productos[i].id_plato};`;
        const [producto] = await db.query( query, { raw: true });

        descripcion += `${productos[i].cantidad}x ${producto[0].descripcion} `;
        precio_total += productos[i].cantidad * producto[0].precio;
    }
    return [descripcion, precio_total];
}

async function insertOrder (req, res) {
    try {
        const newOrder = req.body;
        //armo descripción y precio
        let [descripcion, precio_total ] = await obtenerDescripcionPrecio(req.body.productos);
        // Ahora inserto el cabezal de la orden
        let query = await `INSERT INTO ${dbName}.pedidos (id_cliente, id_forma_pago, descripcion, precio_total)
        VALUES ('${newOrder.id_cliente}',
                '${newOrder.id_forma_pago}',
                '${descripcion}',
                '${precio_total}');`;
        const [idPedido] = await db.query(query, { raw: true });
        await insertOrderDetails(idPedido, req.body.productos);
        res.status(201).json('Pedido realizado bajo el n° ' + idPedido);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function insertOrderDetails(idPedido, productos) {
    for (let i = 0; i < productos.length; i++) {

        //Obtengo el plato a insertar para obtener el precio del mismo
        let query = `SELECT platos.precio
        FROM ${dbName}.platos
        WHERE id_plato = ${productos[i].id_plato};`;
        const [plato] = await db.query( query, { raw: true });

        //Inserto el plato al detalle del pedido
        let insertarQuery = `INSERT INTO ${dbName}.detalle_pedido (id_pedido, id_plato, cantidad, precio)
                    VALUES  ('${idPedido}',
                    '${productos[i].id_plato}',
                    '${productos[i].cantidad}',
                    '${plato[0].precio}');`;
        await db.query( insertarQuery, { raw: true });
    } 
}

//UPDATE /orders
const editOrder = async (req, res) => {
    try {
        const idPedido = req.params.idPedido;
        //elimino descripción y precio
        await deleteOrderDetails(idPedido);
        //armo descripción y precio
        let [descripcion, precio_total ] = await obtenerDescripcionPrecio(req.body.productos);
        // Edito el cabezal de la orden
        let query = `UPDATE ${dbName}.pedidos 
        SET descripcion = '${descripcion}',
        precio_total = '${precio_total}'
        WHERE id_pedido = '${idPedido}';`;
        await db.query(query, {raw: true});

        await insertOrderDetails(idPedido, req.body.productos);
        res.status(202).json('Pedido n° ' + idPedido + ' editado exitosamente');
    } catch (error) {
        res.status(500).json(error);
    }
}

async function deleteOrderDetails(idPedido, req, res) {
    let queryDelete = `DELETE FROM ${dbName}.detalle_pedido WHERE id_pedido = '${idPedido}'`;
    db.query(queryDelete, {raw: true})
        .then((data) => {
            res.status(204).send("Pedido eliminado correctamente.");
        })
        .catch((error) => {
            res.status(500).json(error);
        })
}

//DELETE /orders
const deteleOrder = async (req, res) => {
    try {
        const idPedido = req.params.idPedido;
        //elimino descripción y precio
        await deleteOrderDetails(idPedido);
        // Elimino el cabezal de la orden
        let query = `DELETE FROM ${dbName}.pedidos WHERE id_pedido = '${idPedido}'`;
        await db.query(query, {raw: true});
        res.status(204).json('Pedido n° ' + idPedido + ' eliminado exitosamente.');
    } catch (error) {
        res.status(500).json(error);
    }
}

//EDIT /orderstatus
const orderStatus = (req, res) => {
    const idPedido = req.params.idPedido;
    const idStatus = req.body.id_estado;
    let queryStatus = `UPDATE ${dbName}.pedidos 
        SET id_estado = '${idStatus}'
        WHERE id_pedido = '${idPedido}'`;
    db.query(queryStatus, {raw: true})
        .then((data) => {
            res.status(200).send("Estado del pedido editado correctamente.");
        })
        .catch((error) => {
            res.status(500).json(error);
        })
}


//EXPORTS
module.exports = { getOrders, insertOrder, editOrder, deteleOrder, orderStatus, validateExistingOrder, obligatoryOrderData };