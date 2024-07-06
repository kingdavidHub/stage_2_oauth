export const registerValidationSchema = {
  firstName: {
    notEmpty: {
      errorMessage: "firstName is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "firstName must be at least 3 characters long",
    },
    isString: {
      errorMessage: "firstName must be a string",
    },
  },
  lastName: {
    notEmpty: {
      errorMessage: "lastName is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "lastName must be at least 3 characters long",
    },
    isString: {
      errorMessage: "lastName must be a string",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "password is required",
    },
    isLength: {
      options: { min: 3, max: 15 },
      errorMessage: "password must be at least 3 characters long",
    },
    isString: {
      errorMessage: "password must be a string",
    },
  },
  email: {
    notEmpty: {
      errorMessage: "email is required",
    },
    isEmail: {
      errorMessage: "email must be a valid email",
    },
    isString: {
      errorMessage: "email must be a string",
    },
  },
};

export const loginValidationSchema = {
  email: {
    notEmpty: {
      errorMessage: "email is required",
    },
    isEmail: {
      errorMessage: "email must be a valid email",
    },
    isString: {
      errorMessage: "email must be a string",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "password is required",
    },
    isString: {
      errorMessage: "password must be a string",
    },
  },
};
