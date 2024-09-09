
module.exports=(sequelize,Sequelize)=>{
    const Restaurante=sequelize.define("restaurante",{
        nombre:{
            type:Sequelize.STRING,
            allowNull:false
        },
        direccion:{
            type:Sequelize.STRING,
            allowNull:false
        },
        telefono:{
            type:Sequelize.STRING,
            allowNull:false
        }
        
    });
    return Restaurante;
    }
    