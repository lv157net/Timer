var app = angular.module('TimingApp', ['ngMaterial', 'ngStorage']);

/**
 * Represents a stopwatch that counts down time from its creation
 * @param {number} hours - The number of hours from the object's creation
 * @param {number} minutes - The number of minutes from the object's creation (counted in hours after the value reaches 60)
 * @param {number] seconds - The number of seconds from the object's creation (counted in minutes after the value reaches 60)
 * @param {number} milliseconds - The number of milliseconds from the object's creation (counted in seconds after the value reaches 1000)
 * @param {object} startTime - The Unix time at which the object was (re)started
 * @param {number} counter - The time from the object's creation
 * @param {number} initialValue - The initial value of the counter
 * @param {number} pausedTime - The time at which the object was last paused
 * @param {boolean} started - The object's start state (influences UI buttons)
 * @param {boolean} paused - The object's pause state (influences UI buttons)
 */

app.controller('StopwatchController', function($scope, $timeout, $localStorage) {
    "use strict";

    $scope.storage = $localStorage.$default({
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        startTime: {},
        counter: 0,
        initialValue: 0,
        pausedTime: {},
        started: false,
        paused: false
    });

    /**
     * Called each tick.
     * Changes the counter value, then sets various timing values and repeatedly sets a timeout on itself.
     */

    $scope.onTick = function () {
        //Perform a counter change
        $scope.storage.counter = Math.abs(new Date().getTime() - $scope.storage.startTime);
        ticker = $timeout($scope.onTick, 50);
        // Calculate ms/s/m/h values
        $scope.storage.milliseconds = $scope.storage.counter % 1000;
        $scope.storage.seconds = Math.floor(($scope.storage.counter / 1000 ) % 60);
        $scope.storage.minutes = Math.floor(($scope.storage.counter / (1000 * 60) ) % 60);
        $scope.storage.hours = Math.floor(($scope.storage.counter / (1000 * 60 * 60) ));
    };

    /**
     * Promise to be set to a timeout on the tick function.
     */

    var ticker;

    /**
     * Starts the object, setting the promise. If this is an initial start, sets the startTime value.
     */

    $scope.start = function() {
        if ($scope.storage.paused || !$scope.storage.started)
        {
            if (!$scope.storage.started)
            {
                $scope.storage.startTime = new Date().getTime();
            }
            else
            {
                $scope.storage.startTime = new Date().getTime() - $scope.storage.counter;
            }
            $scope.storage.started = true;
            $scope.storage.paused = false;
            ticker = $timeout($scope.onTick, 50);
        }
    };

    /**
     * Pauses the object without resetting the counter.
     */

    $scope.pause = function () {
        if (!$scope.storage.paused)
        {
            $timeout.cancel(ticker);
            $scope.storage.pausedTime = new Date().getTime();
            $scope.storage.paused = true;
        }
    };

    /**
     * Resets the object to the initial state
     */

    $scope.stop = function () {
        $timeout.cancel(ticker);
        $scope.storage.hours = 0;
        $scope.storage.minutes = 0;
        $scope.storage.seconds = 0;
        $scope.storage.milliseconds = 0;
        $scope.storage.startTime = {};
        $scope.storage.counter = 0;
        $scope.storage.initialValue = 0;
        $scope.storage.pausedTime = {};
        $scope.storage.started = false;
        $scope.storage.paused = false;
    };

    /**
     * Restarts the object, resetting the counter and startTime value.
     */

    $scope.restart = function () {
        $scope.stop();
        $scope.start();
    };
});

/**
 * Represents a timer object
 * @param {number} hours - The number of hours from the object's creation
 * @param {number} minutes - The number of minutes from the object's creation (counted in hours after the value reaches 60)
 * @param {number] seconds - The number of seconds from the object's creation (counted in minutes after the value reaches 60)
 * @param {number} milliseconds - The number of milliseconds from the object's creation (counted in seconds after the value reaches 1000)
 * @param {object} startTime - The Unix time at which the object was (re)started
 * @param {number} counter - The time from the object's creation
 * @param {number} initialValue - The initial value of the counter
 * @param {number} pausedTime - The time at which the object was last paused
 * @param {boolean} started - The object's start state (influences UI buttons)
 * @param {boolean} paused - The object's pause state (influences UI buttons)
 */

app.controller('TimerController', function($scope, $timeout, $localStorage) {
    "use strict";

    $scope.storage = $localStorage.$default({
        timer_hours: 0,
        timer_minutes : 0,
        timer_seconds : 0,
        timer_milliseconds : 0,
        timer_ihours : 0,
        timer_iminutes : 0,
        timer_iseconds : 0,
        timer_imilliseconds : 0,
        timer_startTime : {},
        timer_counter : 0,
        timer_initialValue : 0,
        timer_pausedTime : {},
        timer_started : false,
        timer_paused : false
    });


    /**
     * Called each tick.
     * Changes the counter value, then sets various timing values and repeatedly sets a timeout on itself.
     */

    $scope.onTick = function () {
        //Perform a counter change depending on the object's type
        $scope.storage.timer_counter = $scope.storage.timer_initialValue -  Math.abs(new Date().getTime() - $scope.storage.timer_startTime);
        //Determine if the timer has stopped
        if ($scope.storage.timer_counter > 0)
        {
            ticker = $timeout($scope.onTick, 50);
        }
        else
        {
            $scope.stop();
        }
        // Calculate ms/s/m/h values
        $scope.storage.timer_milliseconds = $scope.storage.timer_counter % 1000;
        $scope.storage.timer_seconds = Math.floor(($scope.storage.timer_counter / 1000 ) % 60);
        $scope.storage.timer_minutes = Math.floor(($scope.storage.timer_counter / (1000 * 60) ) % 60);
        $scope.storage.timer_hours = Math.floor(($scope.storage.timer_counter / (1000 * 60 * 60) ));
    };

    /**
     * Promise to be set to a timeout on the tick function.
     */

    var ticker;

    /**
     * Starts the object, setting the promise. If this is an initial start, sets the startTime value.
     */

    $scope.start = function() {
        if ($scope.storage.timer_paused || !$scope.storage.timer_started)
        {
            if (!$scope.storage.timer_started)
            {
                $scope.storage.timer_startTime = new Date().getTime();
            }
            else
            {
                $scope.storage.timer_startTime += new Date().getTime() -  $scope.storage.timer_pausedTime;
            }
            $scope.storage.timer_initialValue = $scope.storage.timer_ihours * 1000 * 60 * 60 + $scope.storage.timer_iminutes * 1000 * 60 + $scope.storage.timer_iseconds * 1000 + $scope.storage.timer_imilliseconds;
            $scope.storage.timer_started = true;
            $scope.storage.timer_paused = false;
            ticker = $timeout($scope.onTick, 50);
        }
    };

    /**
     * Pauses the object without resetting the counter.
     */

    $scope.pause = function () {
        if (!$scope.storage.timer_paused)
        {
            $timeout.cancel(ticker);
            $scope.storage.timer_pausedTime = new Date().getTime();
            $scope.storage.timer_paused = true;
        }
    };

    /**
     * Resets the object to the initial state
     */

    $scope.stop = function () {
        $timeout.cancel(ticker);
        $scope.storage.timer_hours = 0;
        $scope.storage.timer_minutes = 0;
        $scope.storage.timer_seconds = 0;
        $scope.storage.timer_milliseconds = 0;
        $scope.storage.timer_startTime = {};
        $scope.storage.timer_counter = 0;
        $scope.storage.timer_initialValue = 0;
        $scope.storage.timer_pausedTime = {};
        $scope.storage.timer_started = false;
        $scope.storage.timer_paused = false;
    };

    /**
     * Restarts the object, resetting the counter and startTime value.
     */

    $scope.restart = function () {
        $scope.stop();
        $scope.start();
    };
});

/**
 * Represents an alarm object
 * @param {number} hours - The number of hours from the object's creation
 * @param {number} minutes - The number of minutes from the object's creation (counted in hours after the value reaches 60)
 * @param {number] seconds - The number of seconds from the object's creation (counted in minutes after the value reaches 60)
 * @param {number} milliseconds - The number of milliseconds from the object's creation (counted in seconds after the value reaches 1000)
 * @param {object} startTime - The Unix time at which the object was (re)started
 * @param {number} counter - The time from the object's creation
 * @param {number} initialValue - The initial value of the counter
 * @param {number} pausedTime - The time at which the object was last paused
 * @param {boolean} started - The object's start state (influences UI buttons)
 * @param {boolean} paused - The object's pause state (influences UI buttons)
 */

app.controller('AlarmController', function($scope, $timeout, $localStorage, $mdToast) {

    $scope.storage = $localStorage.$default({
        alarm_hours: 0,
        alarm_minutes : 0,
        alarm_seconds : 0,
        alarm_milliseconds : 0,
        alarm_ihours : 0,
        alarm_iminutes : 0,
        alarm_iseconds : 0,
        alarm_imilliseconds : 0,
        alarm_startTime : {},
        alarm_counter : 0,
        alarm_initialValue : 0,
        alarm_pausedTime : {},
        alarm_started : false,
        alarm_paused : false
    });


    /**
     * Called each tick.
     * Changes the counter value, then sets various timing values and repeatedly sets a timeout on itself.
     */

    $scope.onTick = function () {
        //Perform a counter change depending on the object's type
        $scope.storage.alarm_counter = $scope.storage.alarm_initialValue -  Math.abs(new Date().getTime() - $scope.storage.alarm_startTime);
        //Determine if the alarm has stopped
        if ($scope.storage.alarm_counter > 0)
        {
            ticker = $timeout($scope.onTick, 50);
        }
        else
        {
            $scope.stop();
            $scope.showToast();
        }
        // Calculate ms/s/m/h values
        $scope.storage.alarm_milliseconds = $scope.storage.alarm_counter % 1000;
        $scope.storage.alarm_seconds = Math.floor(($scope.storage.alarm_counter / 1000 ) % 60);
        $scope.storage.alarm_minutes = Math.floor(($scope.storage.alarm_counter / (1000 * 60) ) % 60);
        $scope.storage.alarm_hours = Math.floor(($scope.storage.alarm_counter / (1000 * 60 * 60) ));
    };

    /**
     * Promise to be set to a timeout on the tick function.
     */

    var ticker;

    /**
     * Starts the object, setting the promise. If this is an initial start, sets the startTime value.
     */

    $scope.start = function() {
        if ($scope.storage.alarm_paused || !$scope.storage.alarm_started)
        {
            if (!$scope.storage.alarm_started)
            {
                $scope.storage.alarm_startTime = new Date().getTime();
            }
            else
            {
                $scope.storage.alarm_startTime += new Date().getTime() -  $scope.storage.alarm_pausedTime;
            }
            $scope.storage.alarm_initialValue = $scope.storage.alarm_ihours * 1000 * 60 * 60 + $scope.storage.alarm_iminutes * 1000 * 60 + $scope.storage.alarm_iseconds * 1000 + $scope.storage.alarm_imilliseconds;
            $scope.storage.alarm_started = true;
            $scope.storage.alarm_paused = false;
            ticker = $timeout($scope.onTick, 50);
        }
    };

    /**
     * Pauses the object without resetting the counter.
     */

    $scope.pause = function () {
        if (!$scope.storage.alarm_paused)
        {
            $timeout.cancel(ticker);
            $scope.storage.alarm_pausedTime = new Date().getTime();
            $scope.storage.alarm_paused = true;
        }
    };

    /**
     * Resets the object to the initial state
     */

    $scope.stop = function () {
        $timeout.cancel(ticker);
        $scope.storage.alarm_hours = 0;
        $scope.storage.alarm_minutes = 0;
        $scope.storage.alarm_seconds = 0;
        $scope.storage.alarm_milliseconds = 0;
        $scope.storage.alarm_startTime = {};
        $scope.storage.alarm_counter = 0;
        $scope.storage.alarm_initialValue = 0;
        $scope.storage.alarm_pausedTime = {};
        $scope.storage.alarm_started = false;
        $scope.storage.alarm_paused = false;
    };

    /**
     * Restarts the object, resetting the counter and startTime value.
     */

    $scope.restart = function () {
        $scope.stop();
        $scope.start();
    };

    $scope.getToastPosition = function() {
        return Object.keys($scope.toastPosition)
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
    };

    $scope.showToast = function () {
        $mdToast.show(
            $mdToast.simple()
                .content('Done with the alarm!')
                .position($scope.getToastPosition())
                .hideDelay(1500)
        );
    }
});