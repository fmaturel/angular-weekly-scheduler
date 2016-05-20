angular.module('weeklyScheduler', ['ngWeeklySchedulerTemplates']);

/* jshint -W098 */
var GRID_TEMPLATE = angular.element('<div class="grid-item"></div>');

function mouseScroll(el, delta) {
  el.addEventListener('mousewheel', function (event) {
    if (el.doScroll) {
      el.doScroll(event.wheelDelta > 0 ? 'left' : 'right');
    } else if ((event.wheelDelta || event.detail) > 0) {
      el.scrollLeft -= delta;
    } else {
      el.scrollLeft += delta;
    }
    return false;
  });
}
/*jshint +W098 */