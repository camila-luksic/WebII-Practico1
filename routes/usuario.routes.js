module.exports=app=>{
    let router =require("express").Router();
    const controller=require('../controllers/usuario.controller');

    router.get('/create',controller.createUser);
    router.post('/create',controller.insertUser);
    router.get('/login', controller.login);
    router.post('/login',controller.authenticate);
    router.post('/logout', controller.logout);
    app.use('/usuarios',router)
}
