angular.module('weeklyScheduler')

  .directive('weeklyScheduler', ['weeklySchedulerTimeService', '$log', function (timeService, $log) {

    /**
     * Configure the scheduler.
     * @param schedules
     * @returns {{minDate: *, maxDate: *, nbWeeks: *}}
     */
    function config(schedules) {
      var now = moment();

      // Calculate min date of all scheduled events
      var minDate = schedules.reduce(function (minDate, slot) {
        return timeService.compare(slot.start, 'isBefore', minDate);
      }, now).startOf('week');

      // Calculate max date of all scheduled events
      var maxDate = schedules.reduce(function (maxDate, slot) {
        return timeService.compare(slot.end, 'isAfter', maxDate);
      }, now.clone().add(1, 'year')).endOf('week');

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
      controllerAs: 'scheduleCtrl',
      link: function (scope, element, attrs, ctrls) {
        var schedulerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

        var el = element[0].querySelector('.schedule-area-container');

        if (el) {
          // Install mouse scrolling event listener for H scrolling
          mouseScroll(el, 20);

          ngModelCtrl.$formatters.push(function onModelChange(model) {
            // Keep track of our model (use it in template)
            schedulerCtrl.model = model;

            // First calculate configuration
            schedulerCtrl.config = config(model.schedules);

            // Then resize schedule area knowing the number of weeks in scope
            el.firstChild.style.width = schedulerCtrl.config.nbWeeks / 53 * 200 + '%';

            // Finally, run the sub directives listeners
            schedulerCtrl.$modelChangeListeners.forEach(function (callback) {
              callback(schedulerCtrl.config);
            });
          });
        }
      }
    };
  }]);