angular.module('weeklyScheduler')

  .directive('weeklySlot', ['weeklySchedulerTimeService', function (timeService) {
    return {
      restrict: 'E',
      require: ['^weeklyScheduler', 'ngModel'],
      templateUrl: 'ng-weekly-scheduler/views/weekly-slot.html',
      link: function (scope, element, attrs, ctrls) {
        var schedulerCtrl = ctrls[0], ngModelCtrl = ctrls[1];
        var conf = schedulerCtrl.config;
        var index = scope.$parent.$index;
        var containerEl = element.parent();
        var resizeDirectionIsStart = true;
        var valuesOnDragStart = {start: scope.schedule.start, end: scope.schedule.end};

        var pixelToVal = function (pixel) {
          var percent = pixel / containerEl[0].clientWidth;
          return Math.floor(percent * conf.nbWeeks + 0.5);
        };

        var mergeOverlaps = function () {
          var schedule = scope.schedule;
          var schedules = scope.item.schedules;
          schedules.forEach(function (el) {
            if (el !== schedule) {
              // model is inside another slot
              if (el.end >= schedule.end && el.start <= schedule.start) {
                schedules.splice(schedules.indexOf(el), 1);
                schedule.end = el.end;
                schedule.start = el.start;
              }
              // model completely covers another slot
              else if (schedule.end >= el.end && schedule.start <= el.start) {
                schedules.splice(schedules.indexOf(el), 1);
              }
              // another slot's end is inside current model
              else if (el.end >= schedule.start && el.end <= schedule.end) {
                schedules.splice(schedules.indexOf(el), 1);
                schedule.start = el.start;
              }
              // another slot's start is inside current model
              else if (el.start >= schedule.start && el.start <= schedule.end) {
                schedules.splice(schedules.indexOf(el), 1);
                schedule.end = el.end;
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
          scope.item.schedules.splice(scope.item.schedules.indexOf(scope.schedule), 1);
          containerEl.find('weekly-slot').remove();
          scope.$apply();
        };

        element.find('span').on('click', function (e) {
          e.preventDefault();
          deleteSelf();
        });

        element.on('mouseover', function () {
          containerEl.addClass('slot-hover');
        });

        element.on('mouseleave', function () {
          containerEl.removeClass('slot-hover');
        });


        if (scope.item.editable !== false) {
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
        }

        // on init, merge overlaps
        mergeOverlaps(true);

        //// UI -> model ////////////////////////////////////
        ngModelCtrl.$parsers.push(function onUIChange(ui) {
          ngModelCtrl.$modelValue.start = timeService.addWeek(conf.minDate, ui.start).toDate();
          ngModelCtrl.$modelValue.end = timeService.addWeek(conf.minDate, ui.end).toDate();
          //$log.debug('PARSER :', ngModelCtrl.$modelValue.$$hashKey, index, scope.$index, ngModelCtrl.$modelValue);
          schedulerCtrl.on.change(index, scope.$index, ngModelCtrl.$modelValue);
          return ngModelCtrl.$modelValue;
        });

        //// model -> UI ////////////////////////////////////
        ngModelCtrl.$formatters.push(function onModelChange(model) {
          var ui = {
            start: timeService.weekPreciseDiff(conf.minDate, moment(model.start), true),
            end: timeService.weekPreciseDiff(conf.minDate, moment(model.end), true)
          };
          //$log.debug('FORMATTER :', index, scope.$index, ui);
          return ui;
        });

        ngModelCtrl.$render = function () {
          var ui = ngModelCtrl.$viewValue;
          var css = {
            left: ui.start / conf.nbWeeks * 100 + '%',
            width: (ui.end - ui.start) / conf.nbWeeks * 100 + '%'
          };

          //$log.debug('RENDER :', index, scope.$index, css);
          element.css(css);
        };

        scope.$on('weeklySchedulerLocaleChanged', function () {
          // Simple change object reference so that ngModel triggers formatting & rendering
          scope.schedule = angular.copy(scope.schedule);
        });
      }
    };
  }]);