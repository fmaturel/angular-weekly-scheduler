angular.module('weeklySchedulerI18N', ['tmh.dynamicLocale']);

angular.module('weeklySchedulerI18N')
  .provider('weeklySchedulerLocaleService', ['tmhDynamicLocaleProvider', function (tmhDynamicLocaleProvider) {

    var defaultConfig = {
      doys: {'de-de': 4, 'en-gb': 4, 'en-us': 6, 'fr-fr': 4},
      lang: {
        'de-de': {month: 'Monat', weekNb: 'Wochenummer', addNew: 'Hinzufügen'},
        'en-gb': {month: 'Month', weekNb: 'Week #', addNew: 'Add'},
        'en-us': {month: 'Month', weekNb: 'Week #', addNew: 'Add'},
        'fr-fr': {month: 'Mois', weekNb: 'N° de semaine', addNew: 'Ajouter'}
      }
    };

    this.configure = function (config) {

      if (config && angular.isObject(config)) {
        angular.merge(defaultConfig, config);

        if (defaultConfig.localeLocationPattern) {
          tmhDynamicLocaleProvider.localeLocationPattern(defaultConfig.localeLocationPattern);
        }
      }
    };

    this.$get = ['$rootScope', '$locale', 'tmhDynamicLocale', function ($rootScope, $locale, tmhDynamicLocale) {

      var momentLocaleCache = {};

      function getLang() {
        var key = $locale.id;
        if (!momentLocaleCache[key]) {
          momentLocaleCache[key] = getMomentLocale(key);
          moment.locale(momentLocaleCache[key].id, momentLocaleCache[key].locale);
        } else {
          moment.locale(momentLocaleCache[key].id);
        }
        return defaultConfig.lang[key];
      }

      // We just need few moment local information
      function getMomentLocale(key) {
        return {
          id: key,
          locale: {
            week: {
              // Angular monday = 0 whereas Moment monday = 1
              dow: ($locale.DATETIME_FORMATS.FIRSTDAYOFWEEK + 1) % 7,
              doy: defaultConfig.doys[key]
            }
          }
        };
      }

      $rootScope.$on('$localeChangeSuccess', function () {
        $rootScope.$broadcast('weeklySchedulerLocaleChanged', getLang());
      });

      return {
        $locale: $locale,
        getLang: getLang,
        set: function (key) {
          return tmhDynamicLocale.set(key);
        }
      };
    }];
  }]);