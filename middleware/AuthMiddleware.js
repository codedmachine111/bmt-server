const {verify} = require("jsonwebtoken");

const validateToken = (req,res,next)=>{
    const accessToken = req.header("accessToken");

    if(!accessToken){
        return res.json({message: "User not Logged in"});
    }

    try{
        const validToken = verify(accessToken,"important");
        req.user = validToken;
        if(validToken){
            return next();
        }
    }catch(err) {
        return res.json({message: err});
    }
}

module.exports = {validateToken};