const db = require('mongoose');
const Schema = db.Schema;

let productSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    img: { type: String, required: false },
    categoriaId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    usuarioId: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = db.model('Product', productSchema);