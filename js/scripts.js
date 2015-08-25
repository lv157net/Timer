var app = angular.module('TimingApp', ['ngMaterial']);

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

app.controller('StopwatchController', function($scope, $timeout) {
    "use strict";

    $scope.hours = 0;
    $scope.minutes = 0;
    $scope.seconds = 0;
    $scope.milliseconds = 0;
    $scope.startTime = {};
    $scope.counter = 0;
    $scope.initialValue = 0;
    $scope.pausedTime = {};
    $scope.started = false;
    $scope.paused = false;

    /**
     * Called each tick.
     * Changes the counter value, then sets various timing values and repeatedly sets a timeout on itself.
     */

    $scope.onTick = function () {
        //Perform a counter change
        $scope.counter = Math.abs(new Date().getTime() - $scope.startTime);
        ticker = $timeout($scope.onTick, 50);
        // Calculate ms/s/m/h values
        $scope.milliseconds = $scope.counter % 1000;
        $scope.seconds = Math.floor(($scope.counter / 1000 ) % 60);
        $scope.minutes = Math.floor(($scope.counter / (1000 * 60) ) % 60);
        $scope.hours = Math.floor(($scope.counter / (1000 * 60 * 60) ));
    };

    /**
     * Promise to be set to a timeout on the tick function.
     */

    var ticker;

    /**
     * Starts the object, setting the promise. If this is an initial start, sets the startTime value.
     */

    $scope.start = function() {
        if ($scope.paused || !$scope.started)
        {
            if (!$scope.started)
            {
                $scope.startTime = new Date().getTime();
            }
            else
            {
                $scope.startTime = new Date().getTime() - $scope.counter;
            }
            $scope.initialValue = $scope.ihours * 1000 * 60 * 60 + $scope.iminutes * 1000 * 60 + $scope.iseconds * 1000 + $scope.imilliseconds;
            $scope.started = true;
            $scope.paused = false;
            ticker = $timeout($scope.onTick, 50);
        }
    };

    /**
     * Pauses the object without resetting the counter.
     */

    $scope.pause = function () {
        if (!$scope.paused)
        {
            $timeout.cancel(ticker);
            $scope.pausedTime = new Date().getTime();
            $scope.paused = true;
        }
    };

    /**
     * Resets the object to the initial state
     */

    $scope.stop = function () {
        $timeout.cancel(ticker);
        $scope.hours = 0;
        $scope.minutes = 0;
        $scope.seconds = 0;
        $scope.milliseconds = 0;
        $scope.startTime = {};
        $scope.counter = 0;
        $scope.initialValue = 0;
        $scope.pausedTime = {};
        $scope.started = false;
        $scope.paused = false;
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

app.controller('TimerController', function($scope, $timeout) {
    "use strict";

    $scope.hours = 0;
    $scope.minutes = 0;
    $scope.seconds = 0;
    $scope.milliseconds = 0;
    $scope.ihours = 0;
    $scope.iminutes = 0;
    $scope.iseconds = 0;
    $scope.imilliseconds = 0;
    $scope.startTime = {};
    $scope.counter = 0;
    $scope.initialValue = 0;
    $scope.pausedTime = {};
    $scope.type = '';
    $scope.started = false;
    $scope.paused = false;

    /**
     * Called each tick.
     * Changes the counter value, then sets various timing values and repeatedly sets a timeout on itself.
     */

    $scope.onTick = function () {
        //Perform a counter change depending on the object's type
        $scope.counter = $scope.initialValue -  Math.abs(new Date().getTime() - $scope.startTime);
        //Determine if the timer has stopped
        if ($scope.counter > 0)
        {
            ticker = $timeout($scope.onTick, 50);
        }
        else
        {
            $scope.stop();
        }
        // Calculate ms/s/m/h values
        $scope.milliseconds = $scope.counter % 1000;
        $scope.seconds = Math.floor(($scope.counter / 1000 ) % 60);
        $scope.minutes = Math.floor(($scope.counter / (1000 * 60) ) % 60);
        $scope.hours = Math.floor(($scope.counter / (1000 * 60 * 60) ));
    };

    /**
     * Promise to be set to a timeout on the tick function.
     */

    var ticker;

    /**
     * Starts the object, setting the promise. If this is an initial start, sets the startTime value.
     */

    $scope.start = function() {
        if ($scope.paused || !$scope.started)
        {
            if (!$scope.started)
            {
                $scope.startTime = new Date().getTime();
            }
            else
            {
                $scope.startTime += new Date().getTime() -  $scope.pausedTime;
            }
            $scope.initialValue = $scope.ihours * 1000 * 60 * 60 + $scope.iminutes * 1000 * 60 + $scope.iseconds * 1000 + $scope.imilliseconds;
            $scope.started = true;
            $scope.paused = false;
            ticker = $timeout($scope.onTick, 50);
        }
    };

    /**
     * Pauses the object without resetting the counter.
     */

    $scope.pause = function () {
        if (!$scope.paused)
        {
            $timeout.cancel(ticker);
            $scope.pausedTime = new Date().getTime();
            $scope.paused = true;
        }
    };

    /**
     * Resets the object to the initial state
     */

    $scope.stop = function () {
        $timeout.cancel(ticker);
        $scope.hours = 0;
        $scope.minutes = 0;
        $scope.seconds = 0;
        $scope.milliseconds = 0;
        $scope.startTime = {};
        $scope.counter = 0;
        $scope.initialValue = 0;
        $scope.pausedTime = {};
        $scope.started = false;
        $scope.paused = false;
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

app.controller('AlarmController', function($scope, $timeout, $mdToast) {
    "use strict";

    $scope.hours = 0;
    $scope.minutes = 0;
    $scope.seconds = 0;
    $scope.milliseconds = 0;
    $scope.ihours = 0;
    $scope.iminutes = 0;
    $scope.iseconds = 0;
    $scope.imilliseconds = 0;
    $scope.startTime = {};
    $scope.counter = 0;
    $scope.initialValue = 0;
    $scope.pausedTime = {};
    $scope.started = false;
    $scope.paused = false;

    /**
     * Called each tick.
     * Changes the counter value, then sets various timing values and repeatedly sets a timeout on itself.
     */

    $scope.onTick = function () {
        //Perform a counter change depending on the object's type
        $scope.counter = $scope.initialValue -  Math.abs(new Date().getTime() - $scope.startTime);
        //Determine if the timer has stopped
        if ($scope.counter > 0)
        {
            ticker = $timeout($scope.onTick, 50);
        }
        else
        {
            $scope.stop();
            $scope.showToast();
        }

        // Calculate ms/s/m/h values
        $scope.milliseconds = $scope.counter % 1000;
        $scope.seconds = Math.floor(($scope.counter / 1000 ) % 60);
        $scope.minutes = Math.floor(($scope.counter / (1000 * 60) ) % 60);
        $scope.hours = Math.floor(($scope.counter / (1000 * 60 * 60) ));
    };

    /**
     * Promise to be set to a timeout on the tick function.
     */

    var ticker;

    /**
     * Starts the object, setting the promise. If this is an initial start, sets the startTime value.
     */

    $scope.start = function() {
        if ($scope.paused || !$scope.started)
        {
            if (!$scope.started)
            {
                $scope.startTime = new Date().getTime();
            }
            else
            {
                $scope.startTime += new Date().getTime() -  $scope.pausedTime;
            }
            $scope.initialValue = $scope.ihours * 1000 * 60 * 60 + $scope.iminutes * 1000 * 60 + $scope.iseconds * 1000 + $scope.imilliseconds;
            $scope.started = true;
            $scope.paused = false;
            ticker = $timeout($scope.onTick, 50);
        }
    };

    /**
     * Pauses the object without resetting the counter.
     */

    $scope.pause = function () {
        if (!$scope.paused)
        {
            $timeout.cancel(ticker);
            $scope.pausedTime = new Date().getTime();
            $scope.paused = true;
        }
    };

    /**
     * Resets the object to the initial state
     */

    $scope.stop = function () {
        $timeout.cancel(ticker);
        $scope.hours = 0;
        $scope.minutes = 0;
        $scope.seconds = 0;
        $scope.milliseconds = 0;
        $scope.startTime = {};
        $scope.counter = 0;
        $scope.initialValue = 0;
        $scope.pausedTime = {};
        $scope.started = false;
        $scope.paused = false;
    };

    /**
     * Restarts the object, resetting the counter and startTime value.
     */

    $scope.restart = function () {
        $scope.stop();
        $scope.start();
    };

    /**
     * Shows a toast!
     */

    $scope.toastPosition = {
        bottom: false,
        top: true,
        left: false,
        right: true
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