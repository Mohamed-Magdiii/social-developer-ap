const jwt = require('jsonwebtoken');
const config = require('config');


module.exports  = function (req ,res ,next ){
    //Get token from header 
     const token = req.header('x-auth-token');
     
     //check if not right token 
     if(!token){
       res.status(401).json({msg:'No token , authorized denied'});
     }
    //decode for jwt
    try {
        const decoded =  jwt.verify(token , config.get('jwtSecret'));
         req.user = decoded;
         next();
    } catch (error) {
        res.status(401).json({msg : 'Token is not valid'});
    }
}


