module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define("review", {
        burgerId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'burgers',
                key: 'id'
            },
            onUpdate: 'CASCADE',
        },
        usuarioId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'id'
            },
            onUpdate: 'CASCADE',
        },
        comentario: {
            type: Sequelize.STRING,
            allowNull: false
        },
        estrellas: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    return Review;
}
