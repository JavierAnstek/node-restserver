const jwt = require('jsonwebtoken');

/*********************************
 *        VERIICA EL TOKEN
 ********************************/
// next continual con el programa
let verifyToken = (req, res, next) => {
    /** Así lee el token del request proveniente del header */
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

/*********************************
 *        VERIICA TOKEN URL
 ********************************/
let verifyTokenUrl = (req, res, next) => {
    /** Así lee el token del url */
    let token = req.query.token;
    /** validamos el token */
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err)
            return res.status(401).json({ ok: false, err: { message: 'Token no valido' } });

        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = { verifyToken, verifyAdminRole, verifyTokenUrl };