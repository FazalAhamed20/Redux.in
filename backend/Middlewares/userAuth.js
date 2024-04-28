const jwt =require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config();
const secretkey = process.env.ACCESS_TOKEN;

const verfiyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("jwt token",token)
  if (!token) return res.status(401).json({ error: "access denied" });
  try {
    jwt.verify(token,secretkey, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Failed to authenticate token" });
      }
      req.user = decoded; 
      next(); 
    });
  } catch (error) {
    res.status(401).json({ error: "invalid token" });
  }
};

module.exports=verfiyToken