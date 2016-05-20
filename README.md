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

```
  <link rel="stylesheet" href="https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css">
  <script src="https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js"></script>
```

Add dependency to timeline your angular module: `weeklyScheduler`.

Use the directive:

`<weekly-scheduler class="scheduler" ng-model="myScopeModel" options="options"></weekly-scheduler>`

## License

Released under the MIT License. See the [LICENSE][license] file for further details.

[license]: https://github.com/fmaturel/angular-weekly-scheduler/blob/master/LICENSE
