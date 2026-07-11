export function isUnauthorized(error) {
  return error?.response?.status === 401 || error?.response?.status === 403;
}

export function getApiErrorMessage(error) {
  return error?.response?.data?.message || error?.response?.data?.error || error.message;
}
