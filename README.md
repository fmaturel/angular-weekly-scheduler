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

## License

Released under the MIT License. See the [LICENSE][license] file for further details.

[license]: https://github.com/fmaturel/angular-weekly-scheduler/blob/master/LICENSE
