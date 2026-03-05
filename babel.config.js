module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // Make sure this is a simple array, not an object
    plugins: [
      // Other plugins like reanimated should go here if you use them
    ],
  };
};