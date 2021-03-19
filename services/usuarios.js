//const { MongoLib } = require("../lib/mongo");
const {userSchema} = require("../utils/schemas/usuarios");
const bcrypt = require("bcrypt");

class UsersService {
  constructor() {
    this.collection = "usuarios";
    //this.mongoDB = new MongoLib();
  }

  async getUserByUsuario(usuario) {
    const user = userSchema.findOne({usuario}).exec();
    //const [user] = await this.mongoDB.getAll(this.collection, { usuario: {$regex: usuario, $options: 'i'} });
    return user || {};
  }

  async getUserById(userId) {
    const user = await userSchema.findById(userId);
    //const user = await this.mongoDB.get(this.collection, userId);
    return user || {};
  }

  async createUser({ user }) {
    const { password } = user;

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await (await userSchema.create({...user, password: hashedPassword})).save();
    /* const createdUserId = await this.mongoDB.create(this.collection, {
      user,
      password: hashedPassword,
    }); */
    return createdUser;
  }

  async updateUser({ userId, user }) {
    const existUser = await userSchema.findfindById(userId);
 
    // const existUser = await this.mongoDB.get(this.collection, userId);
    if (!existUser) {
      return null;
    }

    if (user.password) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }

    /* const updatedUserId = await this.mongoDB.update(
      this.collection,
      userId,
      user
    ); */

    const updatedUser = await userSchema.findByIdAndUpdate(userId, user);
    return updatedUser; 
  }

  async deleteUser(userId) {
    const deletedUser = await userSchema.findByIdAndDelete(userId);
    //const deletedUserId = await this.mongoDB.delete(this.collection, userId);
    return deletedUser;
  }
}

module.exports = UsersService;
