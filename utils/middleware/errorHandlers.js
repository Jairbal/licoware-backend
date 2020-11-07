const boom = require('@hapi/boom');
const { config } = require('../../config');

function withErrorStack(error, stack) {
  if (config.dev) {
    return { ...error, stack };
  }

  return error;
}

function logErrors(error, req, res, next) {
  console.log(error);
  next(error);
}

function wrapErrors(error, req, res, next) {
  if (!error.isBoom) {
    next(boom.badImplementation(error));
  }

  next(error);
}

function errorHandler(error, req, res, next) {// eslint-disable-line
  
  const {
    output: { statusCode, payload },
  } = error;
  console.log('Enviando error')
  res.status(statusCode);
  res.json(withErrorStack(payload, error.stack));
}

module.exports = {
  logErrors,
  wrapErrors,
  errorHandler,
};
