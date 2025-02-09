module.exports = {
    env: {
        node: true,
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: 2018,
    },
    rules: {
        "no-console": "off",
        "no-var": "error",
        indent: ["error", 4],
        quotes: ["error", "double"],
        semi: ["error", "always"],
    },
};
