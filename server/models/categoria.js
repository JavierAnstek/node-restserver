const db = require('mongoose');
const Schema = db.Schema;
// se usa para validar campos unique
const uniqueValidator = require('mongoose-unique-validator');

// let schema = new db.Schema;
let categoryShema = new Schema({
    categoria: { type: String, required: [true, 'El campo categoría es obligatorio'], unique: true },
    estado: { type: Boolean, default: true },
    usuarioId: { type: Schema.Types.ObjectId, ref: "User" }
});

/** Agregamos unique-valitaror al schema para gestionar msg de campos unique */
categoryShema.plugin(uniqueValidator, { message: 'Campo {PATH} ya existe' });

/** Exportamos el modelo */
module.exports = db.model('Category', categoryShema);