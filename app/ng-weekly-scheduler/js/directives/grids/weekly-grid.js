/*global GRID_TEMPLATE */
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
      require: '^weeklyScheduler',
      link: function (scope, element, attrs, schedulerCtrl) {
        if (schedulerCtrl.config) {
          doGrid(element, attrs, schedulerCtrl.config);
        }
        schedulerCtrl.$modelChangeListeners.push(function (newModel) {
          doGrid(element, attrs, newModel);
        });
      }
    };
  }]);