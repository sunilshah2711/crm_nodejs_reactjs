const log = require("../log.js");

module.exports.setGenerator = function (plop) {
  plop.setGenerator("controller", {
    description: "Generates podamium page",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What's the name of the Page?",
        validate(value) {
          let message = true;
          if (!/.+/.test(value)) {
            message = log.formatError("Missing", "you must define a page name");
          }

          return message;
        },
      },
    ],
    actions() {
      return [
        {
          type: "add",
          path: "src/pages/{{pascalCase name}}/{{pascalCase name}}.jsx",
          templateFile: "generate/page/templates/page.hbs",
        },
        {
          type: "add",
          path: "src/pages/{{pascalCase name}}/{{pascalCase name}}.module.scss",
          templateFile: "generate/page/templates/styles.hbs",
        },
      ];
    },
  });
};
