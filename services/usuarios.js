const { MongoLib } = require("../lib/mongo");
const bcrypt = require("bcrypt");

class UsersService {
  constructor() {
    this.collection = "usuarios";
    this.mongoDB = new MongoLib();
  }

  async getUserByUsuario(usuario) {
    const [user] = await this.mongoDB.getAll(this.collection, { usuario: {$regex: usuario, $options: 'i'} });
    return user || {};
  }

  async getUserById(userId) {
    const user = await this.mongoDB.get(this.collection, userId);
    return user || {};
  }

  async createUser({ user }) {
    const { password } = user;

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUserId = await this.mongoDB.create(this.collection, {
      user,
      password: hashedPassword,
    });
    return createdUserId;
  }

  async updateUser({ userId, user }) {
    const existUser = await this.mongoDB.get(this.collection, userId);
    if (!existUser) {
      return null;
    }

    if (user.password) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }

    const updatedUserId = await this.mongoDB.update(
      this.collection,
      userId,
      user
    );
    return updatedUserId;
  }

  async deleteUser(userId) {
    const deletedUserId = await this.mongoDB.delete(this.collection, userId);
    return deletedUserId;
  }
}

module.exports = UsersService;
