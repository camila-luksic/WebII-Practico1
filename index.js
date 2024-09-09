

const express=require('express')
const fileUpload = require('express-fileupload');
const bodyParser=require('body-parser')
const app=express()
const path = require('path');

app.use(bodyParser.urlencoded({extended:false}))
app.set('view engine', 'ejs');


app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './public/imagenes'
}));

app.use('/imagenes', express.static(path.join(__dirname, 'public/imagenes')));
// Middleware para servir archivos estáticos

const session = require('express-session');

const db=require("./models");
db.sequelize.sync({
   //force: true // drop tables and recreate
}).then(() => {
    console.log("db resync");
});


//sesiones
app.use(session({
    secret: 'esta es la clave de encriptación de la sesión y puede ser cualquier texto',
    resave: false, // No guarda la sesión en cada solicitud
    saveUninitialized: true, // Guarda las sesiones no inicializadas
    cookie: { secure: false } // Cambia a true si usas HTTPS
}))

//middleware
app.use(function (req, res, next) {
    res.locals.usuario = req.session.usuario;
    next();
});
//
require('./routes')(app);

app.listen(5012)

 //Hecho --
//registro de usuarios*
//login de usuarios*
//catalogo de lugares*
// cada lugar tiene n burgers para ofrecer*
//cada burger con foto descripcion y nombre*
//cada user puede marcar que comio y dejar su review de la burger*
//cada user daja una puntuacion y comentario*
//mostar catalogo*
//entrar a burger*
//ver reviews*
//pag de agregar burgers*
//pag de editar burgers*
//pag de eliminar burgers*
//pag de listar burgers*
//pag de agregar rest*
//pag de editar rest*
//pag de eliminar rest*
//pag de listar rest*
//validaciones*
//Hecho
//Importante--
// to do: bug de crear cuenta y dejar review *
//Dettales--
// arreglar la vista admin*
//agregar boton de log out*
//que solo se pueda ver lo de reviews si inicio sesion igual que log out*
//to do:
//agregar un checkbutton a review*
//controlar que solo pueda dejar una review por burger y usuario*
//list reviews*
