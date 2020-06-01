const db = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/** Crea el esquema */
let rolesValidos = { values: ['ADMIN_ROLE', 'CLIENT_ROLE', 'USER_ROLE'], message: '{VALUE} no es un rol valido' };

/** Creamos la estructura del esquema */
let Schema = db.Schema;
let userSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, required: [true, 'El email es necesario'], unique: true },
    password: { type: String, required: [true, 'El password es obligatorio'] },
    img: { type: String, required: false },
    role: { type: String, default: 'USER_ROLE', enum: rolesValidos },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
});

/** eliminamos que campos no se mostrarán en la respuesta del select */
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

/** Agregamos unique-valitaror al schema para gestionar msg de campos unique */
userSchema.plugin(uniqueValidator, { message: 'Campo {PATH} ya existe' });

/** Exportamos el modelo */
module.exports = db.model('User', userSchema);