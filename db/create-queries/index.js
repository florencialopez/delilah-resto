const { dbName } = require("../sequelize/config");

function createDb() {
    return `CREATE SCHEMA IF NOT EXISTS ${dbName} `;
}

// Creo la tabla USUARIOS  
function createTabUsuarios() {
    return `CREATE TABLE IF NOT EXISTS ${dbName}.usuarios(
        id_cliente INT PRIMARY KEY AUTO_INCREMENT,
        usuario VARCHAR (30) NOT NULL,
        nombre_apellido VARCHAR (60) NOT NULL,
        email VARCHAR (100) NOT NULL,
        tel VARCHAR (11) NOT NULL,
        direccion VARCHAR (120) NOT NULL,
        contrasena VARCHAR (15) NOT NULL,
        admin TINYINT (1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`;
}

// Creo la tabla PLATOS
function createTabPlatos() {
    return `CREATE TABLE IF NOT EXISTS ${dbName}.platos(
        id_plato INT PRIMARY KEY AUTO_INCREMENT,
        descripcion VARCHAR (100) NOT NULL,
        precio DECIMAL (10,0) NOT NULL,
        imagen VARCHAR (200) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`
}

// Creo la tabla PEDIDOS
function createTabPedidos() {
    return `CREATE TABLE IF NOT EXISTS ${dbName}.pedidos (
        id_pedido int(11) NOT NULL AUTO_INCREMENT,
        id_cliente int(11) NOT NULL,
        id_forma_pago int(11) NOT NULL COMMENT 'id forma de pago',
        fecha_hora datetime NOT NULL DEFAULT current_timestamp(),
        id_estado int(11) NOT NULL DEFAULT 1 COMMENT 'id estado del pedido',
        descripcion varchar(300) NOT NULL,
        precio_total decimal(10,0) NOT NULL COMMENT 'precio total del pedido',
        PRIMARY KEY (id_pedido),
        CONSTRAINT pedidos_ibfk_1 FOREIGN KEY (id_forma_pago) REFERENCES forma_pago (id_forma_pago),
        CONSTRAINT pedidos_ibfk_2 FOREIGN KEY (id_estado) REFERENCES estado_pedido (id_estado_pedido),
        CONSTRAINT pedidos_ibfk_3 FOREIGN KEY (id_cliente) REFERENCES usuarios (id_cliente)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
}

// Creo la tabla DETALLE_PEDIDO
function createTabDetallePedido(){
    return `CREATE TABLE IF NOT EXISTS ${dbName}.detalle_pedido (
        id int(11) NOT NULL AUTO_INCREMENT,
        id_pedido int(11) NOT NULL,
        id_plato int(11) NOT NULL,
        cantidad int(11) NOT NULL COMMENT 'num de plato en el pedido',
        precio double(6,2) DEFAULT NULL,
        PRIMARY KEY (id),
        CONSTRAINT detalle_pedido_ibfk_2 FOREIGN KEY (id_plato) REFERENCES platos (id_plato),
        CONSTRAINT detalle_pedido_ibfk_3 FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
}

// Creo la tabla ESTADO_PEDIDO
function createTabEstadoPedido() {
    return `CREATE TABLE IF NOT EXISTS ${dbName}.estado_pedido(
        id_estado_pedido INT PRIMARY KEY AUTO_INCREMENT,
        estado_pedido VARCHAR (20) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`
}

// Creo la tabla FORMA_PAGO
function createTabFormaPago() {
    return `CREATE TABLE IF NOT EXISTS ${dbName}.forma_pago(
        id_forma_pago INT PRIMARY KEY AUTO_INCREMENT,
          forma_pago VARCHAR (20) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`
}

// Creo la tabla PLATOS_FAVORITOS
function createTabPlatosFavoritos() {
    return `CREATE TABLE IF NOT EXISTS ${dbName}.platos_favoritos(
        id_cliente INT INDEX NOT NULL,
          id_plato INT INDEX NOT NULL,
          FOREIGN KEY (id_cliente) REFERENCES usuarios(id_cliente),
          FOREIGN KEY (id_plato) REFERENCES platos(id_plato)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`
}

module.exports = { createDb, createTabUsuarios, createTabPlatos, createTabPedidos, createTabDetallePedido, createTabEstadoPedido, createTabFormaPago, createTabPlatosFavoritos };