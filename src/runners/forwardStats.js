require('dotenv').config();
const mongoose = require('mongoose');

const bossSchema = require('../schemes/boss');

const Boss = mongoose.model('Boss', bossSchema);

mongoose.connect(process.env.MONGODB_RUNNER_URI);

Boss.find().then((bosses) => {
  if (bosses !== null) {
    bosses.forEach((boss) => {
      console.log(`(${boss.name} - ${boss.forwards.length} форвардов`);
    });
  }
});
