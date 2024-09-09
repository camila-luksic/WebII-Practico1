
const db = require('../models');
const User = db.users;    // Asegúrate de que User esté definido aquí
const Burger = db.burgers;
exports.listReviews = async function (req, res) {
    try {
        const reviewsList = await db.reviews.findAll({
            include: [
                {
                    model: User,
                    as: 'usuario',
                    attributes: ['nombre']  // Solo selecciona el nombre del usuario
                },
                {
                    model: Burger,
                    as: 'burger',
                    attributes: ['nombre']  // Solo selecciona el nombre de la hamburguesa
                }
            ]
        });

        res.render('reviews/list', { reviews: reviewsList });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las reviews');
    }
};

exports.createReview = async (req, res) => {
    console.log("*********")
    console.log("id:" + req.params.id);
    try {
        const burgerId = req.params.id;
        const usuarioid = req.session.usuario.id;
        console.log("id:" + req.params.id);
        const burger = await db.burgers.findByPk(burgerId);

        console.log("id:" + burgerId);
        if (!burger) {
            return res.status(404).send('Burger not found');
        }
        const existingReview = await db.reviews.findOne({
            where: {
                burgerId: burgerId,
                usuarioId: usuarioid
            }
        });

        if (existingReview) {
            return res.status(400).send('Ya has dejado una reseña para esta hamburguesa');
        }
        res.render('reviews/form', { burgerId, review: null, errors: null });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};


exports.insertReview = async function (req, res) {
    const usuarioid = req.session.usuario.id;
    const burgerId = req.params.id;

    console.log("//////");
    console.log("Usuario id:" + usuarioid);

    console.log("Burger id:" + burgerId);

    const { errors, review } = validateReviewForm(req);
    if (errors) {
        res.render('reviews/form.ejs', { review: review, errors: errors, });
        return;
    }
    await db.reviews.create({
        burgerId: burgerId,
        usuarioId: usuarioid,
        comentario: req.body.comentario,
        estrellas: req.body.estrellas
    });

    res.redirect("/restaurantes/catalog");

};

//

const validateReviewForm = function (req) {

    if (!req.body.comentario || !req.body.estrellas) {
        const errors = {

            comentario: !req.body.comentario,
            estrellas: !req.body.estrellas
        };
        errors.message = 'Todos los campos son obligatorios';
        const review = {
            comentario: req.body.comentario,
            estrellas: req.body.estrellas
        };
        return { errors, review };
    }
    return { errors: null, review: null };
}