const Appreciation = require("./Appreciation");
//TODO: Import User model

Appreciation.belongsTo(User, { as: "Sender", foreignKey: 'SenderId' });
Appreciation.belongsTo(User, { as: "Receiver", foreignKey: 'ReceiverId' });

User.hasMany(Appreciation, { as: "SentAppreciation", foreignKey: 'SenderId' });
User.hasMany(Appreciation, { as: "ReceivedAppreciation", foreignKey: 'ReceiverId' });


module.exports = {
    Appreciation
    //TODO: Export User model
};