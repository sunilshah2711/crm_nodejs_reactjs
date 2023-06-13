const argv = require('yargs').argv;

const log = require('./generate/log.js');
const generatePage = require('./generate/page/generate.js');
const generateComponent = require('./generate/component/generate.js');

log.logo();

module.exports = function (plop) {
  if (argv['generate-component']) {
    generateComponent.setGenerator(plop);
  } else if (argv['generate-page']) {
    generatePage.setGenerator(plop);
  }
};
