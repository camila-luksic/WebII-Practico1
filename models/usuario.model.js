module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        rol: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'usuario' 
        }
    });
    return Usuario;
};
