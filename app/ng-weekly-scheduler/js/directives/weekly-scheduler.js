/*global mouseScroll */
angular.module('weeklyScheduler')

  .directive('weeklyScheduler', ['$parse', 'weeklySchedulerTimeService', '$log', function ($parse, timeService, $log) {

    /**
     * Configure the scheduler.
     * @param schedules
     * @returns {{minDate: *, maxDate: *, nbWeeks: *}}
     */
    function config(schedules, options) {
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

      var result = angular.extend(options, {minDate: minDate, maxDate: maxDate, nbWeeks: nbWeeks});
      // Log configuration
      $log.debug('Weekly Scheduler configuration:', result);

      return result;
    }

    return {
      restrict: 'E',
      require: ['weeklyScheduler', 'ngModel'],
      transclude: true,
      templateUrl: 'ng-weekly-scheduler/views/weekly-scheduler.html',
      controller: [function () {
        // Will hang our model change listeners
        this.$modelChangeListeners = [];
      }],
      controllerAs: 'schedulerCtrl',
      link: function (scope, element, attrs, ctrls) {
        var schedulerCtrl = ctrls[0], ngModelCtrl = ctrls[1], options = {};

        var el = element[0].querySelector('.schedule-area-container');

        if (el) {
          // Install mouse scrolling event listener for H scrolling
          mouseScroll(el, 20);

          attrs.$observe('options', function () {
            options = angular.extend(options, $parse(attrs.options)(scope));
            console.log('options changed', options);
          });

          ngModelCtrl.$formatters.push(function onModelChange(items) {
            // Check items are present
            if (items) {

              // Check items are in an Array
              if (!angular.isArray(items)) {
                throw 'You should use weekly-scheduler directive with an Array of items';
              }

              // Keep track of our model (use it in template)
              schedulerCtrl.items = items;

              // First calculate configuration
              schedulerCtrl.config = config(items.reduce(function (result, item) {
                var schedules = item.schedules;

                return result.concat(schedules && schedules.length ?
                  // If in multiSlider mode, ensure a schedule array is present on each item
                  // Else only use first element of schedule array
                  (options.monoSchedule ? item.schedules = [schedules[0]] : schedules) :
                  item.schedules = []
                );
              }, []), options);

              schedulerCtrl.on = {
                change: function (itemIndex, scheduleIndex, scheduleValue) {
                  var onChangeFunction = $parse(attrs.onChange)(scope);
                  if (angular.isFunction(onChangeFunction)) {
                    return onChangeFunction(itemIndex, scheduleIndex, scheduleValue);
                  }
                }
              };

              // Then resize schedule area knowing the number of weeks in scope
              el.firstChild.style.width = schedulerCtrl.config.nbWeeks / 53 * 200 + '%';

              // Finally, run the sub directives listeners
              schedulerCtrl.$modelChangeListeners.forEach(function (listener) {
                listener(schedulerCtrl.config);
              });
            }
          });
        }
      }
    };
  }]);