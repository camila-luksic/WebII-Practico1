module.exports=app=>{
    let router =require("express").Router();
    const controller=require('../controllers/burger.controller.js');
    router.get('/',controller.listBurger);
    router.get('/create',controller.createBurger);
    router.post('/create',controller.insertBurger);
    router.get('/:id', controller.showReviewbyBurger);
    router.get('/:id/edit',controller.editBurger);
    router.post('/:id/edit',controller.updateBurger);
    router.post('/:id/delete',controller.deleteBurger);
    router.get("/:id/img", controller.uploadImgGet);
    router.post("/:id/img", controller.uploadImgPost);
    app.use('/burgers',router)
}