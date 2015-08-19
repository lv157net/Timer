var app = angular.module('TimingApp', ['ngMaterial']);

/**
 * Represents a stopwatch that counts down time from its creation
 * @param {number} hours - The number of hours from the object's creation
 * @param {number} minutes - The number of minutes from the object's creation (counted in hours after the value reaches 60)
 * @param {number] seconds - The number of seconds from the object's creation (counted in minutes after the value reaches 60)
 * @param {number} milliseconds - The number of milliseconds from the object's creation (counted in seconds after the value reaches 1000)
 * @param {object} startTime - The Unix time at which the object was (re)started
 * @param {number} counter - The time from the object's creation
 * @param {boolean} started - The object's start state (influences UI buttons)
 * @param {boolean} paused - The object's pause state (influences UI buttons)
 */

app.controller('StopwatchController', function($scope, $interval) {
    "use strict";

    $scope.hours = 0;
    $scope.minutes = 0;
    $scope.seconds = 0;
	$scope.targetHours = 0;
	$scope.targetMinutes = 0;
	$scope.targetSec = 30;
    $scope.milliseconds = 0;
    $scope.startTime = {};
    $scope.counter = 0;

    $scope.started = false;
    $scope.paused = false;
    $scope.target = $scope.targetSec* 1000 + $scope.targetMinutes * 60 * 1000 + $scope.targetHours * 1000 * 3600;
    $scope.prevTarget = 0;
	$scope.showInput = false;

    
    /**
     * Called each tick.
     * Changes the counter value, then sets various timing values and repeatedly sets a timeout on itself.
     */

    $scope.onTick = function () {
        $scope.counter = Math.abs(new Date().getTime() - $scope.startTime);
        $scope.milliseconds = $scope.counter % 1000;
        $scope.seconds = Math.floor(($scope.counter / 1000 ) % 60);
        $scope.minutes = Math.floor(($scope.counter / (1000*60) ) % 60);
        $scope.hours = Math.floor(($scope.counter / (1000 * 60 * 60)));
        if ($scope.target < $scope.counter) {
            $scope.prevTarget = $scope.target;
            $scope.target *= 2;
            $scope.isBlue = !$scope.isBlue;
        }
      
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
            ticker = $interval($scope.onTick, 50);
            $scope.started = true;
            $scope.paused = false;
        }
    };
	

    /**
     * Pauses the stopwatch without resetting the counter.
     */

    $scope.pause = function () {
       
        if (!$scope.paused)
        {
            $interval.cancel(ticker);
            $scope.paused = true;
        }
       
    };
	$scope.toggleInputs = function() {
		$scope.showInput = !$scope.showInput;
		}
    /**
     * Restarts the stopwatch, resetting the counter and startTime value.
     */

    $scope.restart = function () {
        $interval.cancel(ticker);
        $scope.startTime = new Date().getTime();
        $scope.counter = 0;
        $scope.target = $scope.targetSec* 1000 + $scope.targetMinutes * 60 * 1000 + $scope.targetHours * 1000 * 3600;
        $scope.isBlue = false;
        $scope.paused = false;
        ticker = $interval($scope.onTick, 50);
    }
});
