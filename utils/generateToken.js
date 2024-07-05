import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const secret = process.env.JWTSECRET;
  const options = { expiresIn: "24h" };
  return jwt.sign(user, secret, options);
};

export default generateToken;
