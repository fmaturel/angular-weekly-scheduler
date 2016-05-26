angular.module('demoApp', ['weeklyScheduler', 'weeklySchedulerI18N'])

  .config(['weeklySchedulerLocaleServiceProvider', function (localeServiceProvider) {
    localeServiceProvider.configure({
      doys: {'es-es': 4},
      lang: {'es-es': {month: 'Mes', weekNb: 'número de la semana', addNew: 'Añadir'}},
      localeLocationPattern: '/vendor/angular-i18n/angular-locale_{{locale}}.js'
    });
  }])

  .controller('DemoController', ['$scope', '$timeout', 'weeklySchedulerLocaleService', function ($scope, $timeout, localeService) {

    $scope.model = {
      locale: localeService.$locale.id,
      options: {monoSchedule: true},
      items: [{
        label: 'Campaign 1',
        editable: false,
        schedules: [
          {start: moment('2015-12-27').toDate(), end: moment('2016-08-01').toDate()}
        ]
      }]
    };

    // $timeout(function () {
    //   $scope.model.items = $scope.model.items.concat([{
    //     label: 'Campaign 2',
    //     schedules: [
    //       {start: moment('2016-05-03').toDate(), end: moment('2017-02-01').toDate()},
    //       {start: moment('2015-11-20').toDate(), end: moment('2016-02-01').toDate()}
    //     ]
    //   }, {
    //     label: 'Campaign 3',
    //     schedules: [
    //       {start: moment('2017-08-09').toDate(), end: moment('2017-08-21').toDate()},
    //       {start: moment('2017-09-12').toDate(), end: moment('2017-10-12').toDate()}
    //     ]
    //   }]);
    // }, 1000);

    this.reload = function () {
      $scope.model.items = angular.copy($scope.model.items, []);
    };

    this.doSomething = function (itemIndex, scheduleIndex, scheduleValue) {
      console.log('The model has changed!', itemIndex, scheduleIndex, scheduleValue);
    };

    this.onLocaleChange = function () {
      console.log('The locale is changing to', $scope.model.locale);
      localeService.set($scope.model.locale).then(function ($locale) {
        console.log('The locale changed to', $locale.id);
      });
    };
  }]);