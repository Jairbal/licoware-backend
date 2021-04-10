const { FacturaSchema } = require("../utils/schemas/facturas");

class FacturasService {
  async getFacturas() {
    const facturas = await FacturaSchema.find()
      .populate("proveedor")
      .sort({ numero: 1 });
    return facturas || [];
  }

  async getFactura(facturaId) {
    const factura = await FacturaSchema.findById(facturaId).populate(
      "proveedor"
    );
    return factura || {};
  }

  async createFactura({ factura }) {
    // suma del total adquirido
    const reducerTotal = (accumulator, { precio, cantidad }) =>
      accumulator + precio * cantidad;
    const total = factura.productos.reduce(reducerTotal, 0);
    factura.total = total;
    // suma del total de productos adquiridos
    const reducerNumeroProducots = (accumulator, {cantidad}) => accumulator + parseInt(cantidad);
    const numeroProductos = factura.productos.reduce(reducerNumeroProducots, 0);
    factura.numeroProductos = numeroProductos;
    // guardar factura en la base de datos
    const createdFactura = await (await FacturaSchema.create(factura)).save();
    return createdFactura;
  }

  async updateFactura({ facturaId, factura}) {
    const updatedFactura = await FacturaSchema.findByIdAndUpdate(
      facturaId,
      factura
    );
    return updatedFactura;
  }

  async deleteFactura(facturaId) {
    const deletedFactura = await FacturaSchema.findByIdAndDelete(
      facturaId
    );
    return deletedFactura;
  }
}

module.exports = FacturasService;
