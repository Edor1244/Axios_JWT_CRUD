const jwt = require('jwt-simple');
const moment =  require('moment');


const checkToken = (req,res,next) => {
    if(!req.headers['user_token'])
        return res.json({
            error:'No se ha includo el header de autenticacion',
            numero:'001'
        });
    const token =  req.headers['user_token'];
    let payload =  null;
    try {
        payload  =  jwt.decode(token, process.env.TOKEN_KEY)
    } catch (error) {
        return res.json({
           error: 'Token Invalido',
           numero:'002'
        });
    }
    if(moment().unix() > payload.expiresAt){
        return res.json({ 
            error: 'Expiro el token',
            numero:'003'
        });
    }

    if (payload.rol === 'Usuario') {
        return res.json({
            error: 'No tienes permisos para realizar esta acción',
            numero:'004'
        });
    }

    req.userId =  payload.userId;
    req.rolId = payload.rolId;

    next();

}

module.exports = {
    checkToken: checkToken
}