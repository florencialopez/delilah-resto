const jwt = require('jsonwebtoken');
const firma = "ventaComidaDelilahResto";
const { db, dbName } = require("../../db");

//MIDDLEWARES

//VALIDACIÓN DE USUARIO
//datos obligatorios
const obligatoryUserData = (req, res, next) => {
    const {
        usuario,
        nombre_apellido,
        email,
        tel,
        direccion,
        contrasena,
        admin
    } = req.body;
    if(!usuario || !nombre_apellido || !email || !tel || !direccion || !contrasena) {
        res.status(400).json({error: 'Faltan datos obligatorios'});
    } else {
        next();
    }
}

//valido que sea un email
const isEmail = (req, res, next) => {
    const {
        usuario,
        nombreApellido,
        email,
        tel,
        direccion,
        contrasena,
        admin
    } = req.body;
    if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) == false) {
        res.status(409).json("Ingrese un email válido");
    } else {
        next();
    }
}

//valido que el email no esté registrado
const validateExistingEmail = (req, res, next) => {
    const {
        usuario,
        nombreApellido,
        email,
        tel,
        direccion,
        contrasena,
        admin
    } = req.body;
    let queryEmail = `SELECT email FROM ${dbName}.usuarios WHERE email = '${email}'`;
    db.query(queryEmail, {raw: true })
    .then((data) => {
        if (data[0].length >= 1) {
            res.status(409).json("Email ya registrado.");
        } else {
            next();
        }
    })
    .catch((error) => {
        res.status(500).json(error);
     });
}

//valido que el nombre de usuario no este utilizado
const validateExistingUser = (req, res, next) => {
    const {
        usuario,
        nombreApellido,
        email,
        tel,
        direccion,
        contrasena,
        admin
    } = req.body;
    let queryUser = `SELECT usuario FROM ${dbName}.usuarios WHERE usuario = '${usuario}'`;
        db.query(queryUser, {raw:true})
        .then((data) => {
            if (data[0].length >=1) {
                res.status(409).json("Usuario existente. Elija otro nombre de usuario.");
            } else {
                next();
            }
        })
        .catch((error) => {
            res.status(500).json(error);
         });
}

//valido pass
const validatePass = (req, res, next) => {
    const {
        usuario,
        nombreApellido,
        email,
        tel,
        direccion,
        contrasena,
        admin
    } = req.body;
    if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}[^'\s]$/.test(contrasena) == false) {
        res.status(409).json("La contraseña debe tener al menos 8 caracteres, con al menos una mayúscula, un número y un caracter especial.");
    } else {
        next();
    }
}


//TOKEN: inicio seguro
const autenticarUsuario = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verificarToken = jwt.verify(token, firma);
        if(verificarToken) {
            req.usuario = verificarToken;
            next();
        }
    } catch (error) {
        res.status(401).json("Error de autenticación: vuelva a iniciar sesión.");
    }
}

//es Admin?
const validarAdmin = (req, res, next) => {
    if (req.usuario.admin == 1) {
        next();
    } else {
        res.status(403).send("Usuario sin permisos para realizar la acción.");
    }        
}




//FUNCTIONS

// POST /login
const loginUser = (req, res) => {
    const {
        usuario,
        contrasena
    } = req.body;

    let query = `SELECT * FROM ${dbName}.usuarios WHERE usuario= '${usuario}' AND contrasena= '${contrasena}'`;
    db.query(query, {raw: true, type: db.QueryTypes.SELECT})
    .then((data) => {
        if(data[0] && data[0].id_cliente > 0) {
            const token = jwt.sign({
                usuario: data[0].usuario,
                admin: data[0].admin,
                id_cliente: data[0].id_cliente
            }, firma);

            //imprimir token generado
            res.json(token);
        } else {
            res.status(400).send("Usuario o contraseña incorrectos.");
        }
    })
    .catch((error) => {
        res.status(500).json({error});
    });
}

// POST /register
const registerUser = (req, res) => {
    const newUser = req.body;

    let query = `INSERT INTO ${dbName}.usuarios (usuario, nombre_apellido, email, tel, direccion, contrasena, admin) 
    VALUES ('${newUser.usuario}',
            '${newUser.nombre_apellido}',
            '${newUser.email}',
            '${newUser.tel}',
            '${newUser.direccion}',
            '${newUser.contrasena}',
            '${newUser.admin}')`;
    db.query(query, {raw: true})
        .then((data) => {
            res.status(201).send('Usuario creado exitosamente.');
        })
        .catch((error) => {
            res.status(500).json(error);
        })
}

// GET /users
const getUsers = (req, res) => {
    let query = `SELECT * FROM ${dbName}.usuarios`;
    db.query(query, {raw: true})
        .then ((data) => {
            res.status(200).send(data[0]);
        })
        .catch((error) => {
            res.status(500).json(error);
        })
}



//EXPORTS
module.exports = { obligatoryUserData, isEmail, validateExistingEmail, validateExistingUser, validatePass, loginUser, autenticarUsuario, registerUser, validarAdmin, getUsers  };