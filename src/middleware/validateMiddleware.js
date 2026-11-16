const { registerSchema, loginSchema, productSchema, orderSchema } = require('../validations/schemas');

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map((d) => d.message);
      return res.status(400).json({ message: 'Erro de validação', errors: details });
    }
    req.body = value;
    next();
  };
}

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateProduct: validate(productSchema),
  validateOrder: validate(orderSchema)
};
