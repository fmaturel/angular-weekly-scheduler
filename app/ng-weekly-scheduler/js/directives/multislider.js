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