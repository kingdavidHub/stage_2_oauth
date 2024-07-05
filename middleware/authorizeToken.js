import jwt from "jsonwebtoken";

export default (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized",
      statusCode: 401,
    });
  } else {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWTSECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Token is not valid" });
    }
  }
};
