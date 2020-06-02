const jwt = require('jsonwebtoken');

/*********************************
 *        VERIICA EL TOKEN
 ********************************/
// next continual con el programa
let verifyToken = (req, res, next) => {
    /** Así lee el token del request */
    let token = req.get('authorization');

    /** validamos el token */
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err)
            return res.status(401).json({ ok: false, err: { message: 'Token no valido' } });

        req.usuario = decoded.usuario;
        next();
    });
};

/*********************************
 *        VERIICA ADMIN ROLE
 ********************************/
let verifyAdminRole = (req, res, next) => {
    /** Así lee el token del request */
    let user = req.usuario;
    if (user.role != 'ADMIN_ROLE')
        return res.status(401).json({ ok: false, err: { message: 'Rol no valido para esta acción' } });

    next();
};

module.exports = { verifyToken, verifyAdminRole };