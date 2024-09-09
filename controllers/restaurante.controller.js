
const db = require('../models');
const path = require('path');


exports.CatalogRestaurante = function(req, res) {
    const user = req.user; 
    db.restaurantes.findAll()
        .then(restaurantes => {
            res.render("restaurantes/catalog", { restaurantes: restaurantes,user:user });
        })
        .catch(error => {
            console.error('Error fetching restaurants:', error);
            res.status(500).send('Internal Server Error');
        });
};

exports.listRestaurante=function(req,res){
    db.restaurantes.findAll().then(restaurantes=>{
        console.log(restaurantes);
        res.render("restaurantes/list.ejs",{restaurantes:restaurantes})
    });
};
exports.showBurgersByRestaurante = async function(req, res) {
    try {
        const restaurantId = req.params.id;
        const [restaurante, burgers] = await Promise.all([
            db.restaurantes.findByPk(restaurantId),
            db.burgers.findAll({ where: { restauranteID: restaurantId } })
        ]);

        if (!restaurante) {
            return res.status(404).send('Restaurant not found');
        }

        res.render('restaurantes/burgers', { restaurante, burgers });
    } catch (error) {
        console.error('Error while fetching burgers:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createRestaurante=function(req,res){
    res.render("restaurantes/form.ejs",{ restaurante: null,errors: null });
};
exports.insertRestaurante = async function(req, res) {

        const { errors, restaurante } = validateRestForm(req);
        if (errors) {
            res.render('restaurantes/form.ejs', { restaurante:restaurante, errors: errors,});
            return;
        }
        await db.restaurantes.create({
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            telefono:req.body.telefono
        });

        res.redirect("/restaurantes");

};

exports.uploadLogoGet = async function (req, res) {
    const id = req.params.id;
    const restaurante = await db.restaurantes.findByPk(id)
    res.render('restaurantes/uploadLogo.ejs', { restaurante:restaurante, errors: null });
}
exports.uploadLogoPost = async function (req, res) {
    const id = req.params.id;
    const restaurante = await db.restaurantes.findByPk(id)
    if (!req.files?.photo) {
        res.render('restaurantes/uploadLogo.ejs', { errors: { message: 'Debe seleccionar una imagen' }, restaurante });
        return;
    }
    const image = req.files.photo;
    // eslint-disable-next-line no-undef
    const path = __dirname + '/../public/imagenes/logos/' + restaurante.id + '.jpg';

    image.mv(path, function (err) {
        if (err) {
            res.render('restaurantes/uploadLogo.ejs', { errors: { message: 'Error al subir la imagen' }, restaurante });
            console.log(err);
            return;
        }
        res.redirect('/restaurantes');
    });
}

exports.editRestaurante=async function (req, res) {

    const id = req.params.id;
    const restaurante = await db.restaurantes.findByPk(id);
    res.render('restaurantes/form.ejs', { restaurante: restaurante,errors:null });
};

exports.updateRestaurante = async function(req, res) {
    const validacion = validateRestForm(req);
    const errors = validacion.errors;
    const RestErrors = validacion.restaurante;
    if (errors) {
        res.render('restaurantes/form.ejs', { restaurante:RestErrors, errors: errors });
        return;
    }
    try {
        const id = req.params.id;
        const restaurante = await db.restaurantes.findByPk(id);

        if (!restaurante) {
            return res.status(404).send({ error: 'Restaurant not found' });
        }

        restaurante.nombre = req.body.nombre;
        restaurante.direccion = req.body.direccion;
        restaurante.telefono=req.body.telefono;

        await restaurante.save();

        res.redirect('/restaurantes');
    } catch (error) {
        console.error('Error while updating restaurant:', error);
        res.status(500).send({ error: 'Failed to update restaurant' });
    }
};

//

exports.deleteRestaurante= async function (req, res) {
    const id = req.params.id;
    const restaurante = await db.restaurantes.findByPk(id);
    await restaurante.destroy();
    res.redirect('/restaurantes');
};
exports.agregarBurger=function(req,res){
    res.redirect('/burgers/create');
};

const validateRestForm = function (req) {
    
    if (!req.body.nombre || !req.body.direccion ||
        !req.body.telefono ) {
        const errors = {
            nombre: !req.body.nombre,
            direccion: !req.body.direccion,
            telefono:!req.body.telefono
        };
        errors.message = 'Todos los campos son obligatorios';
        const restaurante = {
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            telefono:req.body.telefono
            
        };
        return { errors, restaurante };
    }
    return { errors: null, restaurante: null };
}