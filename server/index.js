const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const app = express();

//Incorporo la libreria de la Base de Datos
const { db } = require("../db");

//Incorporo modulo de seguridad
const { obligatoryUserData, isEmail, validateExistingEmail, validateExistingUser, validatePass, loginUser, autenticarUsuario, registerUser, validarAdmin, getUsers } = require('./security');

//Incoporo módulo de productos
const { getProducts, insertProduct, editProduct, validateExistingProduct, validateExistingProductToEditAndDelete, deleteProduct, obligatoryProductData } = require('./products');

//Incoporo módulo de pedidos
const { getOrders, insertOrder, editOrder, deteleOrder, orderStatus, validateExistingOrder, obligatoryOrderData } = require('./orders');

//Middlewares
app.use(bodyParser.urlencoded({ extended: false })); // parse server aplication/x-www-form-urlencoded
app.use(bodyParser.json()); // parse serverlication/json



//----ENDPOINTS-----

//----SECURITY
//Registro
app.post('/register', obligatoryUserData, isEmail, validateExistingEmail, validateExistingUser, validatePass, registerUser);
//Login
app.post('/login', loginUser);
//Ver usuarios
app.get('/users', autenticarUsuario, validarAdmin, getUsers);


//----PRODUCTS
//Ver productos
app.get('/products', getProducts);
//Agregar producto
app.post('/products', autenticarUsuario, validarAdmin, validateExistingProduct, obligatoryProductData, insertProduct);
//Editar producto
app.put('/products/:idPlato', autenticarUsuario, validarAdmin, validateExistingProductToEditAndDelete, obligatoryProductData, editProduct);
//Eliminar producto
app.delete('/products/:idPlato', autenticarUsuario, validarAdmin, validateExistingProductToEditAndDelete, deleteProduct);

//----ORDERS
//Ver pedidos
app.get('/orders', autenticarUsuario, getOrders);
//Agregar pedido
app.post('/orders', autenticarUsuario, obligatoryOrderData, insertOrder);
//Editar pedido
app.put('/orders/:idPedido', autenticarUsuario, validateExistingOrder, editOrder);
//Eliminar pedido
app.delete('/orders/:idPedido', autenticarUsuario, validateExistingOrder, deteleOrder);
//Editar el estado del pedido
app.put('/orders/status/:idPedido', autenticarUsuario, validarAdmin, validateExistingOrder, orderStatus);



//SERVER LISTEN
app.listen(3000, () => {
    console.log('Servidor iniciado');
})