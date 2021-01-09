const { db, dbName } = require("../../db");

//----MIDDLEWARES
// validateExistingProduct
const validateExistingProduct = (req, res, next) => {
    const newProduct = req.body;
    let query = `SELECT descripcion FROM ${dbName}.platos WHERE descripcion = '${newProduct.descripcion}'`;
    db.query(query, {raw: true, type: db.QueryTypes.SELECT})
    .then((data) => {
        if(data[0] && data[0].descripcion) {
            res.status(409).json("Producto ya existente.");
        } else {
            next();
        }
    })
    .catch((error) => {
        res.status(500).json(error);
    })

}

// validateExistingProductToEditAndDelete
const validateExistingProductToEditAndDelete = (req, res, next) => {
    const idPlato = req.params.idPlato;

    let query = `SELECT * FROM ${dbName}.platos WHERE id_plato = '${idPlato}'`;
    db.query(query, {raw: true, type: db.QueryTypes.SELECT})
    .then((data) => {
        if(data[0] && data[0].id_plato) {
            next();
        } else {
            res.status(409).json("Producto inexistente.");
        }
    })
    .catch((error) => {
        res.status(500).json(error);
    })

}

// obligatoryProductData
const obligatoryProductData = (req, res, next) => {
    const {
        descripcion,
        precio,
        imagen
    } = req.body;
    if(!descripcion || !precio || !imagen) {
        res.status(400).json("Faltan datos obligatorios.");
    } else {
        next();
    }
}


//----FUNCTIONS
// GET products
const getProducts = (req, res) => {
    let query = `SELECT * FROM ${dbName}.platos`;
    db.query(query, {raw: true})
        .then ((data) => {
            res.status(200).send(data[0]);
        })
        .catch((error) => {
            res.status(500).json(error);
        })
}

// INSERT products
const insertProduct = (req, res) => {
    const newProduct = req.body;
    let query = `INSERT INTO ${dbName}.platos (descripcion, precio, imagen) 
    VALUES ('${newProduct.descripcion}',
            '${newProduct.precio}',
            '${newProduct.imagen}')`;
    db.query(query, {raw: true})
        .then((data) => {
            res.status(201).send('Producto agregado correctamente.');
        })
        .catch((error) => {
            res.status(500).json(error);
        })
}

// PUT products/:idPlato
const editProduct = (req, res) => {
    //const editProduct = req.body;
    const idPlato = req.params.idPlato;
    const editProduct = req.body;
    db.query(`USE ${dbName}`, { raw: true });

    let query = `UPDATE ${dbName}.platos
        SET descripcion = '${editProduct.descripcion}',
        precio = '${editProduct.precio}',
        imagen = '${editProduct.imagen}'
        WHERE id_plato = '${idPlato}'`;

        db.query(query, {raw: true})
        .then((data) => {
            res.status(202).send("Producto editado correctamente.");
        })
        .catch((error) => {
            res.status(500).json(error);
        })
};

// DELETE products/:idPlato
const deleteProduct = (req, res) => {
    const idPlato = req.params.idPlato;
    db.query(`USE ${dbName}`, { raw: true });

    let query = `DELETE FROM ${dbName}.platos
        WHERE id_plato = '${idPlato}'`;

        db.query(query, {raw: true})
        .then((data) => {
            res.status(204).send("Producto eliminado correctamente.");
        })
        .catch((error) => {
            res.status(500).json(error);
        })
};



//EXPORTS
module.exports = { getProducts, insertProduct, editProduct, validateExistingProduct, validateExistingProductToEditAndDelete, deleteProduct, obligatoryProductData  };