const { CategoriaSchema } = require('../utils/schemas/categorias');

class CategoriasService {

    async getCategoriaByNombre (nombre) {
        const categoria = await CategoriaSchema.find({ nombre });
        return categoria || null;
    }

    async getCategorias () {
        const categorias = await CategoriaSchema.find()
        .sort({nombre: 1});
        return categorias || [];
    }

    async createCategoria({ categoria }) {
        const createdCategoria = await (
            await CategoriaSchema.create(categoria)
        ).save();
        return createdCategoria;
    }

    async deleteCategoria(categoriaId) {
        const deletedCategoria = await CategoriaSchema.findByIdAndDelete(categoriaId);
        return deletedCategoria;
    }
}

module.exports = CategoriasService;