module.exports = (sequelize, Sequelize) => {
    const Burger = sequelize.define("burger", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        descripcion: {
            type: Sequelize.STRING,
            allowNull: false
        },
        restauranteId: { 
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'restaurantes',
                key: 'id'
            },
            onUpdate: 'CASCADE'
        }
    });
    return Burger;
};
