import jwt from "jsonwebtoken"
import env from "../config/env.js"


const generateToken  = (payload) =>{
    return jwt.sign(payload , env.JWT_SECREAT)
}

const verifyToken = (req,res,next) => {
    try {
    const authHeader  = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized: Token is missing",
      });
    }
    const token  = authHeader.split(" ")[1];

    const decode   = jwt.verify(token , env.JWT_SECREAT);
    req.user = decode;
 return  next()
} catch (error) {
     return res.status(401).json({
     status:false ,  message: "Unauthorized: Invalid or expired token",
    });
}

}

export {generateToken , verifyToken}