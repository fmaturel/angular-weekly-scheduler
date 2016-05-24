angular.module('demoApp', ['weeklyScheduler'])

  .controller('DemoController', function ($scope, $timeout) {

    // $scope.model = {
    //   items: [{
    //     label: 'Campaign 1',
    //     schedules: [
    //       {start: moment('2016-06-03').toDate(), end: moment('2016-08-01').toDate()}
    //     ]
    //   }]
    // };

    $timeout(function () {
      $scope.model = {
        items: [{
          label: 'Campaign 1', schedules: [
            {start: moment('2016-05-03').toDate(), end: moment('2017-02-01').toDate()},
            {start: moment('2015-11-20').toDate(), end: moment('2016-02-01').toDate()}
          ]
        }, {
          label: 'Campaign 2', schedules: [
            {start: moment('2017-08-09').toDate(), end: moment('2017-08-21').toDate()},
            {start: moment('2017-09-12').toDate(), end: moment('2017-10-12').toDate()}
          ]
        }]
      };
    }, 1000);

    // $timeout(function () {
    //   $scope.model = {
    //     items: [{label: 'Campaign 1'}, {label: 'Campaign 2'}, {label: 'Campaign 3'}, {label: 'Campaign 4'}],
    //     schedules: [
    //       {index: 0, start: moment('2016-05-03').toDate(), end: moment('2017-02-01').toDate()},
    //       {index: 1, start: moment('2015-11-20').toDate(), end: moment('2018-02-01').toDate()},
    //       {index: 2, start: moment('2015-01-03').toDate(), end: moment('2017-02-01').toDate()},
    //       {index: 3, start: moment('2018-11-20').toDate(), end: moment('2018-11-30').toDate()}
    //     ]
    //   };
    // }, 3000);

    $scope.whenSomething = function (item) {
      console.log('The model has changed!', item);
    };
  });