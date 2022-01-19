const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    try{
        const token = req.headers.token;
        const decoded = jwt.verify('helloworld');
        req.userData = decoded;
    }catch(error){
        return res.status(401).json({
            message: "authen failed"
        })
    }
    
    next();
}