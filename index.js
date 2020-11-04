const express = require('express');
const conectarBD = require('./config/db');

//Crear el servidor
const app = express();

//Conectar a la base de datos
conectarBD();

//Habilitar express.json
app.use(express.json({extended : true}));

//Puerto de la app
const PORT = process.env.PORT || 4000;

//importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));



app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
})