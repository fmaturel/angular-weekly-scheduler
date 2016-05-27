# angular-weekly-scheduler
A weekly scheduler for angularjs

[![Build Status](https://secure.travis-ci.org/fmaturel/angular-weekly-scheduler.svg)](http:/travis-ci.org/fmaturel/angular-weekly-scheduler)

## Online Demo

http://www.dijit.fr/demo/angular-weekly-scheduler/

[![screenshot](http://www.dijit.fr/demo/angular-weekly-scheduler/screenshot.png)](http://www.dijit.fr/demo/angular-weekly-scheduler/screenshot.png)

## Run @ Home
Run the demo @home with few steps (prerequisite git & node V0.10+ & npm installed):

```
 git clone https://github.com/fmaturel/angular-weekly-scheduler.git && cd angular-weekly-scheduler
 npm install
 npm install -g grunt-cli
```

Then run

`grunt serve:dist`

## Install

> bower install --save angular-weekly-scheduler

or

> npm install --save angular-weekly-scheduler

Add the scripts and css to your index.html.
The `angular-locale_xx-xx.js` file is your locale file

```
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.10/angular.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.4.10/angular-locale_xx-xx.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.js"></script>
  
  <!-- The library to replace with your local copy of ng-weekly-scheduler -->
  <script src="https://github.com/fmaturel/angular-weekly-scheduler/blob/master/dist/js/ng-weekly-scheduler.js"></script>
```

Add dependency to timeline your angular module: `weeklyScheduler`.

Use the directive:

`<weekly-scheduler class="scheduler" ng-model="myScopeModel" options="options"></weekly-scheduler>`

## Features

This directive displays a weekly item scheduler. You can see, add and modify items easily.

### Keyboard shortcuts

* Use <kbd>mouse wheel</kbd> on schedule to scroll left and right</li>
* Use <kbd>ctrl + mouse wheel</kbd> to zoom in and out the schedule</li>

### Schedules

:information_source: This directive uses [MomentJS](http://momentjs.com) to position items and calculate localized calendar weeks.
Drag the time bar start, end and body to quickly change your schedule period.
You can set an `editable` variable on each item, that will be used to disable item edition if `false`.
```javascript
"items": [{
  "label": "Item 1",
  "editable": false,
  "schedules": [
    {
      "start": "2015-12-26T23:00:00.000Z",
      "end": "2016-07-31T22:00:00.000Z"
    }
  ]
}, ...]
```

### Transclusion

This directive is using `ng-transclude` so that everything in `&lt;weekly-scheduler&gt;` element will be treated as the labelling object of one item.

```
<div class="srow">{{::$index + 1}}. {{item.label}}</div>
```

On transcluded item label, the scope contains `item` attribute name containing each item model and regular `ng-repeat` :repeat: scope attributes

### Internationalisation (i18n)

I18N uses [dynamic angular `$locale` change](https://github.com/lgalfaso/angular-dynamic-locale).
An i18n module named `weeklySchedulerI18N` is optionally registered when using the core module :

```javascript
angular.module('demoApp', ['weeklyScheduler', 'weeklySchedulerI18N'])
```

If present, core directive will retrieve current `$locale` and use it to translate labelling elements.
You can add more `$locale` translation using provider `weeklySchedulerLocaleServiceProvider`:

```javascript
angular.module('demoApp', ['weeklyScheduler', 'weeklySchedulerI18N'])
  .config(['weeklySchedulerLocaleServiceProvider', function (localeServiceProvider) {
    localeServiceProvider.configure({
      doys: {'es-es': 4},
      lang: {'es-es': {month: 'Mes', weekNb: 'número de la semana', addNew: 'Añadir'}},
      localeLocationPattern: '/vendor/angular-i18n/angular-locale_{{locale}}.js'
    });
  }])
```

## License

Released under the MIT License. See the [LICENSE][license] file for further details.

[license]: https://github.com/fmaturel/angular-weekly-scheduler/blob/master/LICENSE
