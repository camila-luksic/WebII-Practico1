const db = require('../models');
const path = require('path');

exports.listBurger = function (req, res) {
    db.burgers.findAll({ include: 'restaurante' })
        .then(burgers => {
            console.log(burgers);
            res.render("burgers/list.ejs", { burgers: burgers });
        });
};
exports.viewBurger = async (req, res) => {
    try {
        const burgerId = req.params.id;
        const burger = await db.burgers.findByPk(burgerId);
        
        if (!burger) {
            return res.status(404).send('Hamburguesa no encontrada');
        }
        console.log("----");
        console.log(burger);

        res.render('burgers/burgerDetail.ejs', { burger });
    } catch (error) {
        console.error('Error al obtener los detalles de la hamburguesa:', error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.showReviewbyBurger = async function (req, res) {
    try {
        const burgerId = req.params.id;
        const burger = await db.burgers.findByPk(burgerId);
        const reviews = await db.reviews.findAll({ where: { burgerId: burgerId } });

        console.log(burger);
        console.log(reviews); 

        if (!burger) {
            return res.status(404).send('Burger not found');
        }
        res.render('burgers/burgerDetail', { burger, reviews });
    } catch (error) {
        console.error('Error while fetching burger and reviews:', error);
        res.status(500).send('Internal Server Error');
    }
};



exports.createBurger = async function (req, res) {
    const restaurantes = await db.restaurantes.findAll();
    res.render("burgers/form.ejs", { burger: null, restaurantes, errors: null });
};

exports.insertBurger = async function (req, res) {
    const { errors, burger } = validateBurgerForm(req);
    if (errors) {
        const restaurantes = await db.restaurantes.findAll();
        res.render('burgers/form.ejs', { burger: burger, errors: errors, restaurantes });
        return;
    }

    await db.burgers.create({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        restauranteId: req.body.restauranteId 
    });

    res.redirect("/burgers");
};

exports.uploadImgGet = async function (req, res) {
    const id = req.params.id;
    const burger = await db.burgers.findByPk(id);
    res.render('burgers/uploadImg.ejs', { burger: burger, errors: null });
};

exports.uploadImgPost = async function (req, res) {
    const id = req.params.id;
    const burger = await db.burgers.findByPk(id);
    if (!req.files?.photo) {
        res.render('burgers/uploadImg.ejs', { errors: { message: 'Debe seleccionar una imagen' }, burger });
        return;
    }
    const image = req.files.photo;
    const filePath = path.join(__dirname, '/../public/imagenes/burgers/', burger.id + '.jpg');

    image.mv(filePath, function (err) {
        if (err) {
            res.render('burgers/uploadImg.ejs', { errors: { message: 'Error al subir la imagen' }, burger });
            console.log(err);
            return;
        }
        res.redirect('/restaurantes');
    });
};

exports.editBurger = async function (req, res) {
    const id = req.params.id;
    const burger = await db.burgers.findByPk(id);
    const restaurantes = await db.restaurantes.findAll();
    res.render('burgers/form.ejs', { burger: burger, restaurantes: restaurantes,errors: null  });
};

exports.updateBurger = async function (req, res) {
    const { errors, burger } = validateBurgerForm(req);
    if (errors) {
        res.render('burgers/form.ejs', { burger: burger, errors: errors });
        return;
    }
    try {
        const id = req.params.id;
        const burger = await db.burgers.findByPk(id);

        if (!burger) {
            return res.status(404).send({ error: 'Burger not found' });
        }

        burger.nombre = req.body.nombre;
        burger.descripcion = req.body.descripcion;
        burger.restauranteId = req.body.restauranteId;

        await burger.save();

        res.redirect('/burgers');
    } catch (error) {
        console.error('Error while updating burger:', error);
        res.status(500).send({ error: 'Failed to update burger' });
    }
};

exports.deleteBurger = async function (req, res) {
    const id = req.params.id;
    const burger = await db.burgers.findByPk(id);
    await burger.destroy();
    res.redirect('/burgers');
};


const validateBurgerForm = function (req) {
    let errors = {};

    if (!req.body.nombre || !req.body.descripcion || !req.body.restauranteId) {
        errors.message = 'Todos los campos son obligatorios';
        errors.nombre = !req.body.nombre;
        errors.descripcion = !req.body.descripcion;
        errors.restauranteId = !req.body.restauranteId;
    }

    const burger = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        restauranteId: req.body.restauranteId
    };

    if (Object.keys(errors).length === 0) {
        errors = null;
    }

    return { errors, burger };
};
