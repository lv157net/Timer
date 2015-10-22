/**
 * Created by Rostyslav on 22.10.2015.
 */
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

(function(){
    'use strict';
    angular
        .module('TimingApp')
        .controller('AlarmController', AlarmController);

    AlarmController.$inject = ['$timeout', '$localStorage', '$mdToast'];

    function AlarmController($timeout, $localStorage, $mdToast) {
        var vm = this;

        vm.storage = $localStorage.$default({
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

        vm.toastPosition = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        /**
         * Called each tick.
         * Changes the counter value, then sets various timing values and repeatedly sets a timeout on itself.
         */

        vm.onTick = function () {
            //Perform a counter change depending on the object's type
            vm.storage.alarm_counter = vm.storage.alarm_initialValue -  Math.abs(new Date().getTime() - vm.storage.alarm_startTime);
            //Determine if the alarm has stopped
            if (vm.storage.alarm_counter > 0)
            {
                ticker = $timeout(vm.onTick, 50);
            }
            else
            {
                vm.stop();
                vm.showToast();
            }
            // Calculate ms/s/m/h values
            vm.storage.alarm_milliseconds = vm.storage.alarm_counter % 1000;
            vm.storage.alarm_seconds = Math.floor((vm.storage.alarm_counter / 1000 ) % 60);
            vm.storage.alarm_minutes = Math.floor((vm.storage.alarm_counter / (1000 * 60) ) % 60);
            vm.storage.alarm_hours = Math.floor((vm.storage.alarm_counter / (1000 * 60 * 60) ));
        };

        /**
         * Promise to be set to a timeout on the tick function.
         */

        var ticker;

        /**
         * Starts the object, setting the promise. If this is an initial start, sets the startTime value.
         */

        vm.start = function() {
            if (vm.storage.alarm_paused || !vm.storage.alarm_started)
            {
                if (!vm.storage.alarm_started)
                {
                    vm.storage.alarm_startTime = new Date().getTime();
                }
                else
                {
                    vm.storage.alarm_startTime += new Date().getTime() -  vm.storage.alarm_pausedTime;
                }
                vm.storage.alarm_initialValue = vm.storage.alarm_ihours * 1000 * 60 * 60 + vm.storage.alarm_iminutes * 1000 * 60 + vm.storage.alarm_iseconds * 1000 + vm.storage.alarm_imilliseconds;
                vm.storage.alarm_started = true;
                vm.storage.alarm_paused = false;
                ticker = $timeout(vm.onTick, 50);
            }
        };

        /**
         * Pauses the object without resetting the counter.
         */

        vm.pause = function () {
            if (!vm.storage.alarm_paused)
            {
                $timeout.cancel(ticker);
                vm.storage.alarm_pausedTime = new Date().getTime();
                vm.storage.alarm_paused = true;
            }
        };

        /**
         * Resets the object to the initial state
         */

        vm.stop = function () {
            $timeout.cancel(ticker);
            vm.storage.alarm_hours = 0;
            vm.storage.alarm_minutes = 0;
            vm.storage.alarm_seconds = 0;
            vm.storage.alarm_milliseconds = 0;
            vm.storage.alarm_startTime = {};
            vm.storage.alarm_counter = 0;
            vm.storage.alarm_initialValue = 0;
            vm.storage.alarm_pausedTime = {};
            vm.storage.alarm_started = false;
            vm.storage.alarm_paused = false;
        };

        /**
         * Restarts the object, resetting the counter and startTime value.
         */

        vm.restart = function () {
            vm.stop();
            vm.start();
        };

        vm.getToastPosition = function() {
            return Object.keys(vm.toastPosition)
                .filter(function(pos) { return vm.toastPosition[pos]; })
                .join(' ');
        };

        vm.showToast = function () {
            $mdToast.show(
                $mdToast.simple()
                    .content('Done with the alarm!')
                    .position(vm.getToastPosition())
                    .hideDelay(1500)
            );
        }
}})();