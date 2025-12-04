const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};

config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts, 'ttf', 'woff', 'woff2'],
};

module.exports = config;