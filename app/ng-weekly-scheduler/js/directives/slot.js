angular.module('weeklyScheduler')

  .directive('slot', ['weeklySchedulerTimeService', '$log', function (timeService, $log) {
    return {
      restrict: 'E',
      require: ['^weeklyScheduler', 'ngModel'],
      templateUrl: 'ng-weekly-scheduler/views/slot.html',
      link: function (scope, element, attrs, ctrls) {
        var schedulerCtrl = ctrls[0], ngModelCtrl = ctrls[1];
        var conf = schedulerCtrl.config;
        var containerEl = element.parent();
        var resizeDirectionIsStart = true;
        var valuesOnDragStart = {start: scope.schedule.start, end: scope.schedule.end};

        var pixelToVal = function (pixel) {
          var percent = pixel / containerEl[0].clientWidth;
          return Math.floor(percent * conf.nbWeeks + 0.5);
        };

        scope.startResizeStart = function () {
          resizeDirectionIsStart = true;
          scope.startDrag();
        };

        scope.startResizeEnd = function () {
          resizeDirectionIsStart = false;
          scope.startDrag();
        };

        scope.startDrag = function () {
          element.addClass('active');

          containerEl.addClass('dragging');
          containerEl.attr('no-add', true);

          valuesOnDragStart = {start: ngModelCtrl.$viewValue.start, end: ngModelCtrl.$viewValue.end};
        };

        scope.endDrag = function () {

          // this prevents user from accidentally
          // adding new slot after resizing or dragging
          setTimeout(function () {
            containerEl.removeAttr('no-add');
          }, 500);

          element.removeClass('active');
          containerEl.removeClass('dragging');

          mergeOverlaps();
          scope.$apply();
        };

        scope.resize = function (d) {
          var ui = ngModelCtrl.$viewValue;
          var delta = pixelToVal(d);

          if (resizeDirectionIsStart) {
            var newStart = Math.round(valuesOnDragStart.start + delta);

            if (ui.start !== newStart && newStart <= ui.end - 1 && newStart >= 0) {
              ngModelCtrl.$setViewValue({
                start: newStart,
                end: ui.end
              });
              ngModelCtrl.$render();
            }
          } else {
            var newEnd = Math.round(valuesOnDragStart.end + delta);

            if (ui.end !== newEnd && newEnd >= ui.start + 1 && newEnd <= conf.nbWeeks) {
              ngModelCtrl.$setViewValue({
                start: ui.start,
                end: newEnd
              });
              ngModelCtrl.$render();
            }
          }
        };

        scope.drag = function (d) {
          var ui = ngModelCtrl.$viewValue;
          var delta = pixelToVal(d);
          var duration = valuesOnDragStart.end - valuesOnDragStart.start;

          var newStart = Math.round(valuesOnDragStart.start + delta);
          var newEnd = Math.round(newStart + duration);

          if (ui.start !== newStart && newStart >= 0 && newEnd <= conf.nbWeeks) {
            ngModelCtrl.$setViewValue({
              start: newStart,
              end: newEnd
            });
            ngModelCtrl.$render();
          }
        };

        var mergeOverlaps = function () {
          var schedules = schedulerCtrl.model.schedules;
          schedules.forEach(function (el) {
            if (el !== scope.schedule && el.index === scope.schedule.index) {

              // model is inside another slot
              if (el.end >= scope.schedule.end && el.start <= scope.schedule.start) {
                schedules.splice(schedules.indexOf(el), 1);
                scope.schedule.end = el.end;
                scope.schedule.start = el.start;
              }
              // model completely covers another slot
              else if (scope.schedule.end >= el.end && scope.schedule.start <= el.start) {
                schedules.splice(schedules.indexOf(el), 1);
              }
              // another slot's end is inside current model
              else if (el.end >= scope.schedule.start && el.end <= scope.schedule.end) {
                schedules.splice(schedules.indexOf(el), 1);
                scope.schedule.start = el.start;
              }
              // another slot's start is inside current model
              else if (el.start >= scope.schedule.start && el.start <= scope.schedule.end) {
                schedules.splice(schedules.indexOf(el), 1);
                scope.schedule.end = el.end;
              }
            }
          });
        };

        /**
         * Delete on right click on slot
         */
        var deleteSelf = function () {
          containerEl.removeClass('dragging');
          containerEl.removeClass('slot-hover');
          schedulerCtrl.model.schedules.splice(schedulerCtrl.model.schedules.indexOf(scope.schedule), 1);
          ngModelCtrl.$render();
        };

        element.bind('contextmenu', function (e) {
          e.preventDefault();
          deleteSelf();
        });

        element.on('mouseover', function () {
          containerEl.addClass('slot-hover');
        });

        element.on('mouseleave', function () {
          containerEl.removeClass('slot-hover');
        });

        // on init, merge overlaps
        mergeOverlaps(true);

        //// UI -> model ////////////////////////////////////
        ngModelCtrl.$parsers.push(function onUIChange(ui) {
          ngModelCtrl.$modelValue.start = timeService.addWeek(conf.minDate, ui.start).toDate();
          ngModelCtrl.$modelValue.end = timeService.addWeek(conf.minDate, ui.end).toDate();
          $log.debug('PARSER :', ngModelCtrl.$modelValue);
          return ngModelCtrl.$modelValue;
        });

        //// model -> UI ////////////////////////////////////
        ngModelCtrl.$formatters.push(function onModelChange(model) {
          var ui = {
            start: timeService.weekPreciseDiff(conf.minDate, moment(model.start), true),
            end: timeService.weekPreciseDiff(conf.minDate, moment(model.end), true)
          };
          $log.debug('FORMATTER :', ui);
          return ui;
        });

        ngModelCtrl.$render = function () {
          var ui = ngModelCtrl.$viewValue;
          $log.debug('RENDER :', ui, ui.end - ui.start + 1);
          element.css({
            left: ui.start / conf.nbWeeks * 100 + '%',
            width: (ui.end - ui.start) / conf.nbWeeks * 100 + '%'
          });
          schedulerCtrl.on.change(scope.schedule);
        };
      }
    };
  }]);