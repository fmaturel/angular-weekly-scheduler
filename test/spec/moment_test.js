describe('weeklyScheduler moment tests', function () {
  'use strict';

  var date = '2015-11-20';

  describe('when using moment locales', function () {

    it('the week number for date [' + date + '] start of week and default locale should be 47', function () {
      var minDateDefaultLocale = moment(date);
      var wkNbDefaultLocale = minDateDefaultLocale.clone().startOf('week').week();

      expect(wkNbDefaultLocale).toEqual(47);
    });

    it('the week number for date [' + date + '] start of week and locale fr should be 47', function () {
      moment.locale('fr', {week: {dow: 1, doy: 4}});
      var minDateFr = moment(date);
      var wkNbFr = minDateFr.clone().startOf('week').week();

      expect(wkNbFr).toEqual(47);
    });

    it('the week number for date [' + date + '] start of week and locale us should be 47', function () {
      moment.locale('us', {week: {dow: 1, doy: 6}});
      var minDateUs = moment(date);
      var wkNbUs = minDateUs.clone().startOf('week').week();

      expect(wkNbUs).toEqual(47);
    });
  });
});