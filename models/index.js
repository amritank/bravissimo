
const User = require('./User');
const Appreciation = require('./Appreciation');



Appreciation.belongsTo(User, { as: "Sender", foreignKey: 'SenderId' });
Appreciation.belongsTo(User, { as: "Receiver", foreignKey: 'ReceiverId' });

User.hasMany(Appreciation, { as: "SentAppreciation", foreignKey: 'SenderId' });
User.hasMany(Appreciation, { as: "ReceivedAppreciation", foreignKey: 'ReceiverId' });



module.exports = {
  User,
  Appreciation
};

