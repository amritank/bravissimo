const sequelize = require('../config/connection');
const { Appreciation } = require('../models'); //TODO: Import User model

//TODO: Import users seed json file
const appreciationSeedData = require('./appreciation.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    // TODO: Create user table and enter seed data
    const appreciations = await Appreciation.bulkCreate(appreciationSeedData);

    process.exit(0);
};

seedDatabase();