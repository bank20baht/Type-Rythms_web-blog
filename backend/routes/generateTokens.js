const jwt = require("jsonwebtoken");

function generateTokens(user) {
  const { _id, email, image, name } = user;
  const accessToken = jwt.sign(
    { user_id: _id, email, image, name },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "60m", algorithm: "HS256" }
  );
  const refreshToken = jwt.sign(
    { user_id: _id, email, image, name },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d", algorithm: "HS256" }
  );
  return { accessToken, refreshToken };
}

module.exports = { generateTokens };
