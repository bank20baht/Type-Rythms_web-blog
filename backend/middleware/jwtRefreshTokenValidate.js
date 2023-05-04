const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
      if (!req.headers["authorization"]) return res.sendStatus(401);
  
      const token = req.headers["authorization"].replace("Bearer ", "");
  
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          throw new Error(error);
        } else {
          req.user = decoded;
          req.user.token = token
          delete req.user.exp
          delete req.user.iat
          next();
        }
      });
    } catch (error) {
      return res.sendStatus(403);
    }
  };