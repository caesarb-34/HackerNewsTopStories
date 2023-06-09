module.exports = {
    packages: {
      'angular2-text-mask': {
        ignorableDeepImportMatchers: [
          /text-mask-core\//,
        ]
      },
      'sfg-ng-brand-library': {
        ignorableDeepImportMatchers: [
          /cloudentityjs\//,
        ]
      },
    },
  };