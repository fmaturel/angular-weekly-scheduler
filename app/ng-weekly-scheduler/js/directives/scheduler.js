/*global mouseScroll */
angular.module('weeklyScheduler')

  .directive('weeklyScheduler', ['$parse', 'weeklySchedulerTimeService', '$log', function ($parse, timeService, $log) {

    /**
     * Configure the scheduler.
     * @param schedules
     * @returns {{minDate: *, maxDate: *, nbWeeks: *}}
     */
    function config(schedules) {
      var now = moment();
      var nextYear = now.clone().add(1, 'year');

      // Calculate min date of all scheduled events
      var minDate = (schedules ? schedules.reduce(function (minDate, slot) {
        return timeService.compare(slot.start, 'isBefore', minDate);
      }, now) : now).startOf('week');

      // Calculate max date of all scheduled events
      var maxDate = (schedules ? schedules.reduce(function (maxDate, slot) {
        return timeService.compare(slot.end, 'isAfter', maxDate);
      }, nextYear) : nextYear).endOf('week');

      // Calculate nb of weeks covered by minDate => maxDate
      var nbWeeks = timeService.weekDiff(minDate, maxDate);

      // Log configuration
      $log.debug('Weekly Scheduler configuration:',
        'minDate:', minDate.format(timeService.const.FORMAT),
        'maxDate:', maxDate.format(timeService.const.FORMAT),
        'nbWeeks:', nbWeeks);

      return {minDate: minDate, maxDate: maxDate, nbWeeks: nbWeeks};
    }

    return {
      restrict: 'E',
      require: ['weeklyScheduler', 'ngModel'],
      transclude: true,
      templateUrl: 'ng-weekly-scheduler/views/scheduler.html',
      controller: [function () {
        // Will hang our model change listeners
        this.$modelChangeListeners = [];
      }],
      controllerAs: 'schedulerCtrl',
      link: function (scope, element, attrs, ctrls) {
        var schedulerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

        var el = element[0].querySelector('.schedule-area-container');

        if (el) {
          // Install mouse scrolling event listener for H scrolling
          mouseScroll(el, 20);

          ngModelCtrl.$formatters.push(function onModelChange(model) {
            if (model && model.items) {
              // Keep track of our model (use it in template)
              schedulerCtrl.items = model.items;

              schedulerCtrl.on = {
                change: function (i) {
                  var onChangeFunction = $parse(attrs.onChange)(scope);
                  if (angular.isFunction(onChangeFunction)) {
                    return onChangeFunction(i);
                  }
                }
              };

              // First calculate configuration
              schedulerCtrl.config = config(model.items.reduce(function (result, item) {
                return result.concat(item.schedules);
              }, []));

              // Then resize schedule area knowing the number of weeks in scope
              el.firstChild.style.width = schedulerCtrl.config.nbWeeks / 53 * 200 + '%';

              // Finally, run the sub directives listeners
              schedulerCtrl.$modelChangeListeners.forEach(function (callback) {
                callback(schedulerCtrl.config);
              });
            }
          });
        }
      }
    };
  }]);