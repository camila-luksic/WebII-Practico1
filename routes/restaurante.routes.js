module.exports=app=>{
    let router =require("express").Router();
    const controller=require('../controllers/restaurante.controller.js');
    router.get('/catalog', controller.CatalogRestaurante);
    router.get('/',controller.listRestaurante);
    router.get('/create',controller.createRestaurante);
    router.post('/create',controller.insertRestaurante);
    router.get('/:id/burgers', controller.showBurgersByRestaurante);
    router.get('/:id/agregarBurger',controller.agregarBurger);
    router.get('/:id/edit',controller.editRestaurante);
    router.post('/:id/edit',controller.updateRestaurante);
    router.post('/:id/delete',controller.deleteRestaurante);
    router.get("/:id/logo", controller.uploadLogoGet);
    router.post("/:id/logo", controller.uploadLogoPost);
    app.use('/restaurantes',router)
}