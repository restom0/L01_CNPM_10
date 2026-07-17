/**
 * Check whether API error means auth is invalid.
 *
 * @param {object} error - Axios error.
 * @returns {boolean} True when API returned 401 or 403.
 */
export function isUnauthorized(error) {
  return error?.response?.status === 401 || error?.response?.status === 403;
}

/**
 * Extract best API error message from Axios error shape.
 *
 * @param {object} error - Axios error.
 * @returns {string} User-facing error message.
 */
export function getApiErrorMessage(error) {
  return error?.response?.data?.message || error?.response?.data?.error || error.message;
}

/**
 * Prefix API error message with localized error label.
 *
 * @param {Function} t - Translation function.
 * @param {object} error - Axios error.
 * @returns {string} Localized error text.
 */
export function getTranslatedApiErrorMessage(t, error) {
  return `${t("common.error")}: ${getApiErrorMessage(error)}`;
}
