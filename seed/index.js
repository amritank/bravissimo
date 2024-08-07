


















const bcrypt = require('bcrypt');
const { User } = require('../models/User'); 


const seedUsers = async () => {
    for (const userData of users) {
      try {
        const user = await User.create(userData);
        console.log(`Created user: ${user.first_name} ${user.last_name}`);
      } catch (error) {
        console.error(`Error creating user: ${userData.first_name} ${userData.last_name}`, error);
      }
    }
  };
  
  seedUsers().then(() => {
    console.log('Seed data inserted');
    process.exit();
  }).catch((error) => {
    console.error('Error seeding data:', error);
    process.exit(1);
  });