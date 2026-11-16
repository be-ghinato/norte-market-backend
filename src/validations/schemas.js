const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'O nome é obrigatório',
    'string.min': 'O nome deve ter pelo menos 2 caracteres',
    'any.required': 'O nome é obrigatório'
  }),
  email: Joi.string().email().trim().lowercase().required().messages({
    'string.email': 'Informe um e-mail válido',
    'any.required': 'O e-mail é obrigatório'
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.min': 'A senha deve ter pelo menos 6 caracteres',
    'any.required': 'A senha é obrigatória'
  }),
  role: Joi.string().valid('customer', 'admin').default('customer')
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    'string.email': 'Informe um e-mail válido',
    'any.required': 'O e-mail é obrigatório'
  }),
  password: Joi.string().required().messages({
    'any.required': 'A senha é obrigatória'
  })
});

const productSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required().messages({
    'string.empty': 'O nome do produto é obrigatório',
    'any.required': 'O nome do produto é obrigatório'
  }),
  price: Joi.number().positive().required().messages({
    'number.positive': 'O preço deve ser maior que zero',
    'any.required': 'O preço é obrigatório'
  }),
  category: Joi.string().trim().max(100).allow('').optional(),
  stock: Joi.number().integer().min(0).default(0)
});

const orderSchema = Joi.object({
  total: Joi.number().positive().required().messages({
    'number.positive': 'O total deve ser maior que zero',
    'any.required': 'O total é obrigatório'
  }),
  status: Joi.string().valid('pendente', 'pago', 'enviado', 'entregue', 'cancelado').default('pendente')
});

module.exports = { registerSchema, loginSchema, productSchema, orderSchema };
