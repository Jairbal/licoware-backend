const { FacturaSchema } = require("../utils/schemas/facturas");

class FacturasService {

  async getFacturas() {
    const facturas = await FacturaSchema.find()
      .populate("proveedor")
      .sort({ numero: 1 });
    return facturas || [];
  }

  async createFactura({ factura }) {
    const createdFactura = await (await FacturaSchema.create(factura)).save();
    return createdFactura;
  }
}

module.exports = FacturasService;