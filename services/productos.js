const { ProductoSchema } = require("../utils/schemas/productos");

class ProductosService {

  async getProductoByNombre (nombre) {
    const producto = await ProductoSchema.find({ nombre });
    return producto || null;
}

  async getProductos() {
    const productos = await ProductoSchema.find()
      .populate("categoria")
      .sort({ categoria: 1 });
    return productos || [];
  }

  async getProducto(productoId) {
    const producto = await ProductoSchema.findById(productoId).populate(
      "categoria"
    );
    return producto || {};
  }

  async createProducto({ producto }) {
    const createdProducto = await (
      await ProductoSchema.create(producto)
    ).save();
    return createdProducto;
  }

  async updateProducto({ productoId, producto }) {
    const updatedProducto = await ProductoSchema.findByIdAndUpdate(
      productoId,
      producto
    );
    return updatedProducto;
  }

  async deleteProducto(productoId) {
    const deletedProducto = await ProductoSchema.findByIdAndDelete(productoId);
    return deletedProducto;
  }
}

module.exports = ProductosService;
