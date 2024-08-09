const sequelize = require('../config/connection');
const { Appreciation, User} = require('../models'); 


const userSeedData = require('./user.json');
const appreciationSeedData = require('./appreciation.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

 
    const users = await User.bulkCreate(userSeedData, {individualHooks: true});

    const appreciations = await Appreciation.bulkCreate(appreciationSeedData);


    process.exit(0);
};

seedDatabase();