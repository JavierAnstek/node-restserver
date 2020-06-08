/*********************************
 *          PUERTO
 ********************************/
process.env.PORT = process.env.PORT || 3000;

/*********************************
 *          ENTORNO
 ********************************/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*********************************
 *         SECRET KEY
 ********************************/
process.env.SECRET_TOKEN = process.env.SECRET_TOKEN || 'secretdevtoken';

/*********************************
 *        TOKEN EXPIRE
 ********************************/
//seg * min * hor * diaS: ej 30 dias, 60*60*24*30 
process.env.EXPIRE_TOKEN = '48h';

/*********************************
 *      GOOGLE CLIENT
 ********************************/
process.env.ID_CLIENT_GOOGLE = process.env.ID_CLIENT_GOOGLE || 'IDCLIENT';

/*********************************
 *        BASE DE DATOS
 ********************************/
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;