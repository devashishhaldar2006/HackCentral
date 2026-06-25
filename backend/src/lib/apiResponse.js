export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  const response = { success: true, message };
  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

export const sendError = (res, message, statusCode = 400, error = null) => {
  const response = { success: false, message };
  if (error) {
    response.error = error;
  }
  return res.status(statusCode).json(response);
};
