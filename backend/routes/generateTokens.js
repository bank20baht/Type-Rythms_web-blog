const jwt = require("jsonwebtoken");

function generateTokens(user) {
  const { _id, email } = user;
  const accessToken = jwt.sign(
    { user_id: _id, email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "2m", algorithm: "HS256" }
  );
  const refreshToken = jwt.sign(
    { user_id: _id, email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d", algorithm: "HS256" }
  );
  return { accessToken, refreshToken };
}

module.exports = { generateTokens };
