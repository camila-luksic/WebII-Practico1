module.exports=app=>{

    require("./restaurante.routes.js")(app);
    require("./burger.routes.js")(app);
    require("./usuario.routes.js")(app);
    require("./reviews.routes.js")(app);
    
}