const log = require("../log.js");

module.exports.setGenerator = function (plop) {
  // Controller generator
  plop.setGenerator("controller", {
    description: "Generates podamium component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What's the name of the Component?",
        validate(value) {
          let message = true;
          if (!/.+/.test(value)) {
            message = log.formatError(
              "Missing",
              "you must define a component name"
            );
          }

          return message;
        },
      },
    ],
    actions() {
      return [
        {
          type: "add",
          path: "src/components/{{pascalCase name}}/{{pascalCase name}}.jsx",
          templateFile: "generate/component/templates/component.hbs",
        },
        {
          type: "add",
          path: "src/components/{{pascalCase name}}/{{pascalCase name}}.module.scss",
          templateFile: "generate/component/templates/styles.hbs",
        },
      ];
    },
  });
};
