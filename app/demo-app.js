angular.module('demoApp', ['weeklyScheduler'])

  .controller('DemoController', function ($scope, $timeout) {

    $scope.model = {
      options: {monoSchedule: true, labels: {month: 'Mois', weekNb: 'N° de semaine', addNew: 'Ajouter'}},
      items: [{
        label: 'Campaign 1',
        editable: false,
        schedules: [
          {start: moment('2016-06-03').toDate(), end: moment('2016-08-01').toDate()}
        ]
      }]
    };

    $timeout(function () {
      $scope.model.items = $scope.model.items.concat([{
        label: 'Campaign 2',
        schedules: [
          {start: moment('2016-05-03').toDate(), end: moment('2017-02-01').toDate()},
          {start: moment('2015-11-20').toDate(), end: moment('2016-02-01').toDate()}
        ]
      }, {
        label: 'Campaign 3',
        schedules: [
          {start: moment('2017-08-09').toDate(), end: moment('2017-08-21').toDate()},
          {start: moment('2017-09-12').toDate(), end: moment('2017-10-12').toDate()}
        ]
      }]);
    }, 1000);

    $scope.doSomething = function (itemIndex, scheduleIndex, scheduleValue) {
      console.log('The model has changed!', itemIndex, scheduleIndex, scheduleValue);
    };
  });