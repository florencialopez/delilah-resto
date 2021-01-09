# DELILAH RESTÓ
***
La API para tu restaurant: permite administrar una lista de usuarios, platos y pedidos a través de la conexión con una base de datos MySQLi que permite almacenar los datos.

#### Características
- Registro e inicio de sesión de usuarios.
- Autenticación de usuarios.
- Validación de roles: administrador o no administrador.
- Funciones de productos: agregar, editar y eliminar.
- Funciones de pedidos: agregar, editar y eliminar.

***

### Para empezar
#### Clonar el respositorio
> git clone https://github.com/NoelBq/delilah-resto.git

#### Instalar las dependencias de NodeJS
> npm install

#### Configuración de la base de datos
- Ejecutar un servidor MySQL.
- Crear la base de datos de manera automática con el siguiente comando:
> cd db/db-setup
> node index.js

##### Importante
- Para cambiar la configuración de la base de datos (host, nombre, puerto, usuario y contraseña) acceder al archivo **db/sequelize/config.js**
- Para cambiar la información de muestra de las tablas, editar los archivos **.csv** ubicados en **db/data**

***

### Para ejecutar la API
Iniciarlizar el servidor a través del siguiente comando:
> cd ..
> cd ..
> cd server
> node index.js
