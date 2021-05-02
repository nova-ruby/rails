module.exports = {
    root: true,
    env: {
        commonjs: true,
        "nova/nova": true,
    },
    extends: ["plugin:prettier/recommended"],
    plugins: ["nova", "prettier"],
    rules: {
        "prettier/prettier": "error",
    },
};
