const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("mjs");

config.server = {
  enhanceMiddleware: (metroMiddleware) => {
    return (req, res, next) => {
      res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
      res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
      metroMiddleware(req, res, next);
    };
  },
};

module.exports = config;
