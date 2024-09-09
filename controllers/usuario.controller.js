
const db = require('../models');
const sha1 = require('sha1');

exports.login = async function (req, res) {
    res.render('usuarios/login.ejs', { errors: null });
}
exports.authenticate = async function (req, res) {
    const usuario = await db.users.findOne({
        where: {
            email: req.body.email,
            password: sha1(req.body.password)
        }
    });
    if (usuario) {
        req.session.usuario = usuario;
        console.log(req.session.usuario);
        console.log(usuario);
        res.redirect('/restaurantes/catalog'); 
    } else {
        res.render('usuarios/login.ejs', { errors: { message: 'Usuario o contraseña incorrectos' } });
    }
}
exports.logout = async function (req, res) {
    req.session.usuario = null;  
    res.redirect('/usuarios/login'); 
}



exports.createUser = function(req, res) {
    res.render("usuarios/form.ejs", { usuario: null, errors: null });
};
exports.insertUser = async function(req, res) {

    const { errors, usuario } = validateUserForm(req);
    if (errors) {
        res.render('usuarios/form.ejs', { usuario: usuario, errors: errors });
        return;
    }
    try {
        const nuevoUsuario=await db.users.create({
            nombre: req.body.nombre,
            email: req.body.email,
            password: sha1(req.body.password),
            rol: 'usuario'
        });
            req.session.usuario = nuevoUsuario;

        res.redirect('/restaurantes/catalog');
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).send("Error al crear el usuario");
    }
};

const validateUserForm = function(req) {
    let errors = {};
    const { nombre, email, password, rol } = req.body;
    if (!req.body.nombre || !req.body.email|| !req.body.password) {
        errors.message = 'Todos los campos son obligatorios';
    }
    if (!nombre) {
        errors.nombre = 'El nombre es obligatorio';
    }
    if (!email) {
        errors.email = 'El email es obligatorio';
    }
    if (!password) {
        errors.password = 'La contraseña es obligatoria';
    }
    const usuario = {
        nombre: nombre || '',
        email: email || '',
        password: password || '',
        rol: rol || 'usuario'
    };

    return {
        errors: Object.keys(errors).length > 0 ? errors : null,
        usuario
    };
};