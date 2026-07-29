const sendResponse = (res, statusCode, message, data = null, meta = {}) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...meta,
  });
};

module.exports = sendResponse;
