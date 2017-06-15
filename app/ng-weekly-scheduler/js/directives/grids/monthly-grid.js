/* global GRID_TEMPLATE, CLICK_ON_A_CELL */
angular.module('weeklyScheduler')
  .directive('monthlyGrid', ['weeklySchedulerTimeService', function (timeService) {

    function handleClickEvent(child, totalWidth, nbMonths, idx, scope) {
      child.bind('click', function () {
        scope.$broadcast(CLICK_ON_A_CELL, {
          nbElements: nbMonths,
          idx: idx,
          percentWidthFromBeginning: totalWidth
        });
      });
    }

    function doGrid(scope, element, attrs, model) {
      // Clean element
      element.empty();

      // Calculation month distribution
      var months = timeService.monthDistribution(model.minDate, model.maxDate);

      var totalWidth = 0;
      // Deploy the grid system on element
        var child = GRID_TEMPLATE.clone().css({width: month.width + '%'});
      months.forEach(function (month, idx) {
        if (angular.isUndefined(attrs.noText)) {
          handleClickEvent(child, totalWidth, months.length, idx, scope);
          child.text(timeService.dF(month.start.toDate(), 'MMM yyyy'));
        }
        totalWidth += month.width;
        element.append(child);
      });
    }

    return {
      restrict: 'E',
      require: '^weeklyScheduler',
      link: function (scope, element, attrs, schedulerCtrl) {
        schedulerCtrl.$modelChangeListeners.push(function (newModel) {
          doGrid(scope, element, attrs, newModel);
        });
      }
    };
  }]);