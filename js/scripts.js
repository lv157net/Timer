var app = angular.module('TimingApp', ['ngMaterial']);

/**
 * Represents an object that performs a time-related action at a certain interval
 * @param {number} hours - The number of hours from the object's creation
 * @param {number} minutes - The number of minutes from the object's creation (counted in hours after the value reaches 60)
 * @param {number] seconds - The number of seconds from the object's creation (counted in minutes after the value reaches 60)
 * @param {number} milliseconds - The number of milliseconds from the object's creation (counted in seconds after the value reaches 1000)
 * @param {object} startTime - The Unix time at which the object was (re)started
 * @param {number} counter - The time from the object's creation
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
    $scope.type = '';
    $scope.started = false;
    $scope.paused = false;
    $scope.speedDialIsOpen = false;

    /**
     * Called each tick.
     * Changes the counter value, then sets various timing values and repeatedly sets a timeout on itself.
     */

    $scope.onTick = function () {
        if ($scope.type === 'Stopwatch') {
            $scope.counter = Math.abs(new Date().getTime() - $scope.startTime);

        }
        else if ($scope.type === 'Timer') {
            $scope.counter = $scope.initialValue -  Math.abs(new Date().getTime() - $scope.startTime);
        }
        if ($scope.counter > 0) {

            ticker = $timeout($scope.onTick, 50);
        }
        else
        {
            $scope.counter = 0;
        }
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
     * Starts the stopwatch, setting the promise. If this is an initial start, sets the startTime value.
     */

    $scope.start = function() {
        if ($scope.paused || !$scope.started)
        {
            if (!$scope.started)
            {
                $scope.startTime = new Date().getTime();
            }
            $scope.initialValue = $scope.hours * 1000 * 60 * 60 + $scope.minutes * 1000 * 60 + $scope.seconds * 1000 + $scope.milliseconds;
            $scope.started = true;
            $scope.paused = false;
            ticker = $timeout($scope.onTick, 50);
        }
    };

    /**
     * Pauses the stopwatch without resetting the counter.
     */

    $scope.pause = function () {
        if (!$scope.paused)
        {
            $timeout.cancel(ticker);
            $scope.paused = true;
        }
    };

    /**
     * Restarts the stopwatch, resetting the counter and startTime value.
     */

    $scope.restart = function () {
        $timeout.cancel(ticker);
        $scope.startTime = new Date().getTime();
        $scope.counter = 0;
        $scope.paused = false;
        ticker = $timeout($scope.onTick, $scope.speed);
    }
});