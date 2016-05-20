;(function( window, undefined ){ 
 'use strict';

angular.module('weeklyScheduler', ['ngWeeklySchedulerTemplates']);

var GRID_TEMPLATE = angular.element('<div class="grid-item"></div>');

function mouseScroll(el, delta) {
  el.addEventListener("mousewheel", function (event) {
    if (el.doScroll)
      el.doScroll(event.wheelDelta > 0 ? "left" : "right");
    else if ((event.wheelDelta || event.detail) > 0)
      el.scrollLeft -= delta;
    else
      el.scrollLeft += delta;

    return false;
  });
}

angular.module('weeklyScheduler')
  .directive('monthlyGrid', ['weeklySchedulerTimeService', function (timeService) {

    function doGrid(element, attrs, model) {
      // Clean element
      element.empty();

      // Calculation month distribution
      var months = timeService.monthDistribution(model.minDate, model.maxDate);

      // Deploy the grid system on element
      months.forEach(function (month) {
        var child = GRID_TEMPLATE.clone().css({width: month.width + '%'});
        if (angular.isUndefined(attrs.noText)) {
          child.text(timeService.dF(month.start.toDate(), 'MMM yyyy'));
        }
        element.append(child);
      });
    }

    return {
      restrict: 'E',
      require: ['^weeklyScheduler'],
      link: function (scope, element, attrs, ctrl) {
        ctrl[0].$modelChangeListeners.push(function (newModel) {
          doGrid(element, attrs, newModel);
        });
      }
    };
  }]);
angular.module('weeklyScheduler')
  .directive('weeklyGrid', [function () {

    function doGrid(element, attrs, model) {
      var i;
      // Calculate week width distribution
      var tickcount = model.nbWeeks;
      var ticksize = 100 / tickcount;
      var gridItemEl = GRID_TEMPLATE.css({width: ticksize + '%'});
      var now = model.minDate.clone().startOf('week');

      // Clean element
      element.empty();

      for (i = 0; i < tickcount; i++) {
        var child = gridItemEl.clone();
        if (angular.isUndefined(attrs.noText)) {
          child.text(now.add(i && 1, 'week').week());
        }
        element.append(child);
      }
    }

    return {
      restrict: 'E',
      require: ['^weeklyScheduler'],
      link: function (scope, element, attrs, ctrl) {
        var schedulerCtrl = ctrl[0];
        if(schedulerCtrl.config) {
          doGrid(element, attrs, schedulerCtrl.config);
        }
        schedulerCtrl.$modelChangeListeners.push(function (newModel) {
          doGrid(element, attrs, newModel);
        });
      }
    };
  }]);
angular.module('weeklyScheduler')
  .directive('handle', ['$document', function ($document) {
    return {
      scope: {
        ondrag: '=',
        ondragstop: '=',
        ondragstart: '='
      },
      restrict: 'A',
      link: function (scope, element) {

        var x = 0;

        element.on('mousedown', function (event) {
          // Prevent default dragging of selected content
          event.preventDefault();

          x = event.pageX;

          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);

          if (scope.ondragstart) {
            scope.ondragstart();
          }
        });

        function mousemove(event) {
          var delta = event.pageX - x;
          scope.ondrag(delta);
        }

        function mouseup() {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);

          if (scope.ondragstop) {
            scope.ondragstop();
          }
        }
      }
    };
  }]);
angular.module('weeklyScheduler')
  .directive('inject', [function () {

    return {
      link: function ($scope, $element, $attrs, controller, $transclude) {
        if (!$transclude) {
          throw minErr('ngTransclude')('orphan',
            'Illegal use of ngTransclude directive in the template! ' +
            'No parent directive that requires a transclusion found. ' +
            'Element: {0}',
            startingTag($element));
        }
        var innerScope = $scope.$new();
        $transclude(innerScope, function (clone) {
          $element.empty();
          $element.append(clone);
          $element.on('$destroy', function () {
            innerScope.$destroy();
          });
        });
      }
    };
  }]);
angular.module('weeklyScheduler')

  .filter('byIndex', [function () {
    return function (input, index) {
      var ret = [];
      angular.forEach(input, function (el) {
        if (el.index === index) {
          ret.push(el);
        }
      });
      return ret;
    };
  }])

  .directive('multiSlider', [function () {
    return {
      restrict: 'E',
      require: ['^weeklyScheduler'],
      scope: {
        index: '=',
        schedules: '='
      },
      templateUrl: 'ng-weekly-scheduler/views/multi-slider.html',
      link: function (scope, element, attrs, ctrls) {
        var conf = ctrls[0].config;
        
        // The default scheduler block size when adding a new item
        var defaultNewScheduleSize = parseInt(attrs.size) || 8;

        var elScheduleArea = document.querySelector('.schedule-area-container');

        var elOffX = element[0].getBoundingClientRect().left;

        var valToPixel = function (val) {
          var percent = val / (conf.nbWeeks);
          return Math.floor(percent * element[0].clientWidth + 0.5);
        };

        var pixelToVal = function (pixel) {
          var percent = pixel / element[0].clientWidth;
          return Math.floor(percent * (conf.nbWeeks) + 0.5);
        };

        var addSlot = function (start, end) {
          start = start >= 0 ? start : 0;
          end = end <= conf.nbWeeks ? end : conf.nbWeeks;

          var startDate = conf.minDate.clone().add(start, 'week');
          var endDate = conf.minDate.clone().add(end, 'week');

          scope.$apply(function () {
            scope.schedules.push({index: scope.index, start: startDate.toDate(), end: endDate.toDate()});
          });
        };


        var hoverElement = angular.element(element.find('div')[0]);
        var hoverElementWidth = valToPixel(defaultNewScheduleSize);

        hoverElement.css({
          width: hoverElementWidth + 'px'
        });

        element.on('mousemove', function (e) {
          hoverElement.css({
            left: elScheduleArea.scrollLeft + e.pageX - elOffX - hoverElementWidth / 2 + 'px'
          });
        });

        hoverElement.on('click', function (event) {
          if (!element.attr('no-add')) {
            var pixelOnClick = elScheduleArea.scrollLeft + event.pageX - elOffX;
            var valOnClick = pixelToVal(pixelOnClick);

            var start = Math.round(valOnClick - defaultNewScheduleSize / 2);
            var end = start + defaultNewScheduleSize;

            console.log(start, end);
            addSlot(start, end);
          }
        });
      }
    };
  }]);
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
angular.module('weeklyScheduler')

  .directive('slot', ['$rootScope', '$log', function ($rootScope, $log) {
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
          return Math.floor(percent * (conf.nbWeeks) + 0.5);
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
          scope.schedules.forEach(function (el) {
            if (el !== scope.schedule && el.index === scope.schedule.index) {

              // model is inside another slot
              if (el.end >= scope.schedule.end && el.start <= scope.schedule.start) {
                scope.schedules.splice(scope.schedules.indexOf(el), 1);
                scope.schedule.end = el.end;
                scope.schedule.start = el.start;
              }
              // model completely covers another slot
              else if (scope.schedule.end >= el.end && scope.schedule.start <= el.start) {
                scope.schedules.splice(scope.schedules.indexOf(el), 1);
              }
              // another slot's end is inside current model
              else if (el.end >= scope.schedule.start && el.end <= scope.schedule.end) {
                scope.schedules.splice(scope.schedules.indexOf(el), 1);
                scope.schedule.start = el.start;
              }
              // another slot's start is inside current model
              else if (el.start >= scope.schedule.start && el.start <= scope.schedule.end) {
                scope.schedules.splice(scope.schedules.indexOf(el), 1);
                scope.schedule.end = el.end;
              }
            }
          });
        };

        var deleteSelf = function () {
          containerEl.removeClass('dragging');
          containerEl.removeClass('slot-hover');
          scope.schedules.splice(scope.schedules.indexOf(scope.schedule), 1);
        };

        element.bind('contextmenu', function (e) {
          e.preventDefault();
          deleteSelf();
          scope.$apply();
        });

        element.on('mouseover', function () {
          containerEl.addClass('slot-hover');
        });

        element.on('mouseleave', function () {
          containerEl.removeClass('slot-hover');
        });

        // on init, merge overlaps
        mergeOverlaps(true);

        //// UI -> Model ////////////////////////////////////
        ngModelCtrl.$parsers.push(function onUIChange(ui) {
          ngModelCtrl.$modelValue.start = conf.minDate.clone().add(ui.start, 'week').toDate();
          ngModelCtrl.$modelValue.end = conf.minDate.clone().add(ui.end, 'week').toDate();
          $log.debug('PARSER :', ngModelCtrl.$modelValue);
          return ngModelCtrl.$modelValue;
        });

        //// model -> UI ////////////////////////////////////
        ngModelCtrl.$formatters.push(function onModelChange(model) {
          var ui = {
            start: moment(model.start).diff(conf.minDate, 'week', true),
            end: moment(model.end).diff(conf.minDate, 'week', true)
          };
          $log.debug('FORMATTER :', ui);
          return ui;
        });

        ngModelCtrl.$render = function () {
          var ui = ngModelCtrl.$viewValue;
          $log.debug('RENDER :', ui, ui.end - ui.start + 1);
          element.css({
            left: ui.start / (conf.nbWeeks) * 100 + '%',
            width: (ui.end - ui.start) / (conf.nbWeeks) * 100 + '%'
          });
          scope.$eval(attrs.ngChange);
        };
      }
    };
  }]);
angular.module('weeklyScheduler')
  .service('weeklySchedulerTimeService', ['$filter', '$locale', function ($filter, $locale) {

    var MONTH = 'month';
    var WEEK = 'week';
    var DAY = 'day';

    moment.locale('fr', {
      week: {
        dow: $locale.DATETIME_FORMATS.FIRSTDAYOFWEEK + 1, // Monday is the first day of the week.
        doy: 4  // The week that contains Jan 4th is the first week of the year.
      }
    });

    return {
      const: {
        MONTH: MONTH,
        WEEK: WEEK,
        FORMAT: 'YYYY-MM-DD'
      },
      dF: $filter('date'),
      compare: function (date, method, lastMin) {
        if (date) {
          var dateAsMoment;
          if (angular.isDate(date)) {
            dateAsMoment = moment(date);
          } else if (date._isAMomentObject) {
            dateAsMoment = date;
          } else {
            throw 'Could not parse date [' + date + ']';
          }
          return dateAsMoment[method](lastMin) ? dateAsMoment : lastMin;
        }
      },
      weekDiff: function (start, end) {
        return end.clone().endOf(WEEK).diff(start.clone().startOf(WEEK), WEEK) + 1;
      },
      monthDiff: function (start, end) {
        return end.clone().endOf(MONTH).diff(start.clone().startOf(MONTH), MONTH) + 1;
      },
      monthDistribution: function (minDate, maxDate) {
        var i, result = [];
        var startDate = minDate.clone();
        var endDate = maxDate.clone();
        var monthDiff = this.monthDiff(startDate, endDate);
        var dayDiff = endDate.diff(startDate, DAY);

        //var total = 0, totalDays = 0;
        // console.log(startDate.toDate(), endDate.toDate(), monthDiff, dayDiff);
        for (i = 0; i < monthDiff; i++) {
          var startOfMonth = i === 0 ? startDate : startDate.add(1, MONTH).startOf(MONTH);
          var endOfMonth = i === monthDiff - 1 ? endDate : startDate.clone().endOf(MONTH);
          var dayInMonth = endOfMonth.diff(startOfMonth, DAY) + (i !== monthDiff - 1 && 1);
          var width = Math.floor(dayInMonth / dayDiff * 1E8) / 1E6;

          result.push({start: startOfMonth.clone(), end: endOfMonth.clone(), width: width});

          // totalDays += dayInMonth; total += width;
          // console.log(startOfMonth, endOfMonth, dayInMonth, dayDiff, width, total, totalDays);
        }
        return result;
      }
    };
  }]);
angular.module('ngWeeklySchedulerTemplates', ['ng-weekly-scheduler/views/multi-slider.html', 'ng-weekly-scheduler/views/scheduler.html', 'ng-weekly-scheduler/views/slot.html']);

angular.module('ng-weekly-scheduler/views/multi-slider.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('ng-weekly-scheduler/views/multi-slider.html',
    '<div class="slot ghost">Add New</div><slot class=slot ng-repeat="schedule in schedules | byIndex:index" slots=schedules ng-model=schedule></slot>');
}]);

angular.module('ng-weekly-scheduler/views/scheduler.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('ng-weekly-scheduler/views/scheduler.html',
    '<div class=labels><div class="srow text-right">Month</div><div class="srow text-right">Week number</div><div ng-repeat="item in scheduleCtrl.model.items" inject></div></div><div class=schedule-area-container><div class=schedule-area><div class="srow timestamps"><monthly-grid class=grid-container></monthly-grid></div><div class="srow timestamps"><weekly-grid class=grid-container></weekly-grid></div><div class=srow ng-repeat="item in scheduleCtrl.model.items"><weekly-grid class="grid-container striped" no-text></weekly-grid><multi-slider index=$index schedules=scheduleCtrl.model.schedules></multi-slider></div></div></div>');
}]);

angular.module('ng-weekly-scheduler/views/slot.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('ng-weekly-scheduler/views/slot.html',
    '<div title="{{::schedule.start | date}} - {{::schedule.end | date}}"><div class="handle left" ondrag=resize ondragstart=startResizeStart ondragstop=endDrag handle></div><div class=content ondrag=drag ondragstart=startDrag ondragstop=endDrag handle>{{::schedule.start | date}} - {{::schedule.end | date}}</div><div class="handle right" ondrag=resize ondragstart=startResizeEnd ondragstop=endDrag handle></div></div>');
}]);
}( window ));