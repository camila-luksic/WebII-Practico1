const dbConfig=require("../config/db.config.js");
const Sequelize=require("sequelize");
const sequelize=new Sequelize(
    dbConfig.Db,
    dbConfig.User,
    dbConfig.Password,
    {
        host:dbConfig.Host,
        port:dbConfig.Port,
        dialect:"mysql",
    }
);

const db={};
db.Sequelize=Sequelize;
db.sequelize=sequelize;

db.burgers = require("./burger.model.js")(sequelize, Sequelize);
db.users=require("./usuario.model.js")(sequelize,Sequelize);
db.restaurantes=require("./restaurante.model.js")(sequelize,Sequelize);
db.reviews=require("./review.model.js")(sequelize,Sequelize);

db.restaurantes.hasMany(db.burgers, { as: "burger" });
db.burgers.belongsTo(db.restaurantes, {
    foreignKey: "restauranteId",  
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    as: "restaurante"
});


db.burgers.hasMany(db.reviews, { as: "review" });
db.reviews.belongsTo(db.burgers, {
    foreignKey: "burgerId",
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    as: "burger"
});

db.users.hasMany(db.reviews, { as: "review" });
db.reviews.belongsTo(db.users, {
    foreignKey: "userId",
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    as: "usuario"
});


module.exports=db;
