// Standardized API response format
const sendResponse = (res, statusCode, success, data = null, error = null) => {
  const response = {
    success,
    ...(data && { data }),
    ...(error && { error })
  };

  return res.status(statusCode).json(response);
};

// Success response helper
const sendSuccess = (res, data = null, statusCode = 200, message = null) => {
  return sendResponse(res, statusCode, true, {
    ...data,
    ...(message && { message })
  });
};

// Error response helper
const sendError = (res, statusCode = 500, message = 'Internal Server Error', code = 'ERROR', details = null) => {
  return sendResponse(res, statusCode, false, null, {
    code,
    message,
    ...(details && { details })
  });
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError
};
