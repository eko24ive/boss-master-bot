const { Schema } = require('mongoose');

const bossScheme = new Schema({
  name: String,
  forwards: [{
    hpCurrent: Number,
    hpMax: Number,
    damage: Number,
    armor: Number,
    strength: Number,
    precision: Number,
    charisma: Number,
    agility: Number,
    endurance: Number,
    time: Number,
    stamp: String,
    distance: Number,
    user: {
      username: String,
      id: Number,
    },
  }],
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

module.exports = bossScheme;
