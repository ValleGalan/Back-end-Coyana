const uploadProductPermission = require('../../helpers/permission');
const productModel = require('../../models/productModel');

async function deleteProductController(req, res) {
    try {
        // Verificar permisos
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permission denied");
        }

        const { _id } = req.params;

        // Eliminar el producto
        const deletedProduct = await productModel.findByIdAndDelete(_id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Producto no encontrado",
                success: false,
                error: true
            });
        }

        // Respuesta exitosa
        res.json({
            message: "Producto eliminado exitosamente",
            success: true,
            error: false,
            data : deletedProduct

        });

    } catch (err) {
        res.status(400).json({
            message: err?.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = deleteProductController;
