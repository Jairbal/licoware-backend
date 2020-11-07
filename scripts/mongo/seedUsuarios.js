//set DEBUG=app:* & node scripts/mongo/seedUsuarios.js

const bcrypt = require('bcrypt');
const chalk = require('chalk');
const debug = require('debug')('app:scripts:usuarios');
const {MongoLib} = require('../../lib/mongo');

const users = [
  {
    nombre: 'Jair',
    apellido: 'Balcazar',
    usuario: 'root@root.jb',
    password: 'Rootjb',
    rol: 'admin',
    createdAt: new Date().toISOString()
  },
];

async function createUser(mongoDB, user) {
  const { password } = user;
  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await mongoDB.create('usuarios', {
    ...user,
    password: hashedPassword,
  });

  return userId;
}

async function seedUsers() {
  try {
    const mongoDB = new MongoLib();

    const promises = users.map(async user => {
      const userId = await createUser(mongoDB, user);
      debug(chalk.green('User created with id:', userId));
    });

    await Promise.all(promises);
    return process.exit(0);
  } catch (error) {
    debug(chalk.red(error));
    process.exit(1);
  }
}

seedUsers();