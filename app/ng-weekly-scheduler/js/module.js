angular.module('weeklyScheduler', ['ngWeeklySchedulerTemplates']);

/* jshint -W098 */
var GRID_TEMPLATE = angular.element('<div class="grid-item"></div>');
var CLICK_ON_A_CELL = 'clickOnACell';

var isCtrl;

function ctrlCheck(e) {
  if (e.which === 17) {
    isCtrl = e.type === 'keydown';
  }
}

function mouseScroll(el, delta) {

  window.addEventListener('keydown', ctrlCheck);
  window.addEventListener('keyup', ctrlCheck);

  el.addEventListener('mousewheel', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (isCtrl) {
      var style = el.firstChild.style, currentWidth = parseInt(style.width);
      if ((e.wheelDelta || e.detail) > 0) {
        style.width = (currentWidth + 2 * delta) + '%';
      } else {
        var width = currentWidth - 2 * delta;
        style.width = (width > 100 ? width : 100) + '%';
      }
    } else {
      if ((e.wheelDelta || e.detail) > 0) {
        el.scrollLeft -= delta;
      } else {
        el.scrollLeft += delta;
      }
    }
    return false;
  });
}

function zoomInACell(el, event, data) {

  var nbElements = data.nbElements;
  var idx = data.idx;
  // percentWidthFromBeginning is used when the first element of the grid is not full
  // For instance, in the example below `feb 17` is not full
  // feb 17          march 17
  //       |                          |
  var percentWidthFromBeginning = data.percentWidthFromBeginning;

  var containerWidth = el.offsetWidth;

  // leave (1/3) each side
  // 1/3 |    3/3   | 1/3
  var boxWidth = containerWidth / (5 / 3);
  var gutterSize = boxWidth / 3;

  var scheduleAreaWidthPx = nbElements * boxWidth;
  var scheduleAreaWidthPercent = (scheduleAreaWidthPx / containerWidth) * 100;

  el.firstChild.style.width = scheduleAreaWidthPercent + '%';

  if (percentWidthFromBeginning === undefined) {
    // All cells of a line have the same size
    el.scrollLeft = idx * boxWidth - gutterSize;
  } else {
    // Sizes of cells in a line could different (especially the first one)
    el.scrollLeft = scheduleAreaWidthPx * (percentWidthFromBeginning / 100) - gutterSize;
  }
}
/* jshint +W098 */
