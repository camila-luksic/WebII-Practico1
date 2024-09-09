module.exports=app=>{
    let router =require("express").Router();
    const controller=require('../controllers/review.controller.js');
    router.get('/',controller.listReviews);
    router.get('/:id/create',controller.createReview);
    router.post('/:id/create',controller.insertReview);
    app.use('/reviews',router)
}