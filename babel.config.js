module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ["transform-remove-console"],
    }
  },
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '~app/assets/images': './app/assets/images',
          '~app/components': './app/components',
          '~app/constants': './app/constants',
          '~app/models': './app/models',
          '~app/navigation': './app/navigation',
          '~app/screens': './app/screens',
          '~app/state': './app/state',
          '~app/styles': './app/styles',
          '~app/utils': './app/utils',
          '~app/hooks': './app/hooks',
          '~app/api': './app/api',
        },
      },
    ],
  ],
};
