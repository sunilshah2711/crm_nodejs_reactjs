/* eslint-disable no-console */

/**
 * Render Logo
 */
function logo() {
  console.log("Welcome to podamium");
}

/**
 * Error
 * @param {string} title
 * @param {string} body
 */
function error(title, body) {
  console.log(formatError(title, body));
}

/**
 * Format Error
 * @param {string} title
 * @param {string} body
 */
function formatError(title, body) {
  return `${title} ${body}`;
}

module.exports.logo = logo;
module.exports.error = error;
module.exports.formatError = formatError;
/* eslint-enable no-console */
