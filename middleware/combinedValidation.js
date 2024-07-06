import { checkSchema, validationResult } from "express-validator";
import { registerValidationSchema } from "../utils/validationSchema.js";

export const register_validation = [
  checkSchema(registerValidationSchema),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: "Validation error: Missing required fields",
        errors: errors.array(),
        statusCode: 422,
      });
    }
    next();
  },
];
