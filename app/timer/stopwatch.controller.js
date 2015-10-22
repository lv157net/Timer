/**
 * Created by Rostyslav on 22.10.2015.
 */
/**
 * Represents a stopwatch that counts down time from its creation
 * @param {number} stopwatch_hours - The number of stopwatch_hours from the object's creation
 * @param {number} stopwatch_minutes - The number of stopwatch_minutes from the object's creation (counted in stopwatch_hours after the value reaches 60)
 * @param {number] stopwatch_seconds - The number of stopwatch_seconds from the object's creation (counted in stopwatch_minutes after the value reaches 60)
 * @param {number} stopwatch_milliseconds - The number of stopwatch_milliseconds from the object's creation (counted in stopwatch_seconds after the value reaches 1000)
 * @param {object} startTime - The Unix time at which the object was (re)stopwatch_started
 * @param {number} stopwatch_counter - The time from the object's creation
 * @param {number} initialValue - The initial value of the stopwatch_counter
 * @param {number} pausedTime - The time at which the object was last stopwatch_paused
 * @param {boolean} stopwatch_started - The object's start state (influences UI buttons)
 * @param {boolean} stopwatch_paused - The object's pause state (influences UI buttons)
 */

(function(){
    'use strict';
    angular
        .module('TimingApp')
        .controller('StopwatchController', StopwatchController);

    StopwatchController.$inject = ['$timeout', '$localStorage', 'timeConsts', 'settings'];

    function StopwatchController ($timeout, $localStorage, timeConsts, settings) {
        var vm = this;
        var ticker;
        vm.start = start;
        vm.pause = pause;
        vm.onTick = onTick;
        vm.restart = restart;
        vm.stop = stop;
        vm.isPauseDisabled = isPauseDisabled;
        vm.isStartDisabled = isStartDisabled;
        vm.isRestartDisabled = isRestartDisabled;

        vm.storage = $localStorage.$default({
            stopwatch_hours: 0,
            stopwatch_minutes: 0,
            stopwatch_seconds: 0,
            stopwatch_milliseconds: 0,
            stopwatch_startTime: {},
            stopwatch_counter: 0,
            stopwatch_initialValue: 0,
            stopwatch_pausedTime: {},
            stopwatch_started: false,
            stopwatch_paused: false
        });

        activate();

        function activate() {
            if(vm.storage.stopwatch_started && !vm.storage.stopwatch_paused) {
                onTick();
            }
         }

        function isPauseDisabled() {
            return (!vm.storage.stopwatch_started || vm.storage.stopwatch_paused);
          }

        function isStartDisabled() {
            return vm.storage.stopwatch_started && !vm.storage.stopwatch_paused;
        }

        function isRestartDisabled() {
            return !vm.storage.stopwatch_started;
        }

        function onTick() {
            //Perform a stopwatch_counter change
            vm.storage.stopwatch_counter = Math.abs(new Date().getTime() - vm.storage.stopwatch_startTime);
            ticker = $timeout(vm.onTick, settings.TICK_STEP);
            // Calculate ms/s/m/h values
            vm.storage.stopwatch_milliseconds = vm.storage.stopwatch_counter % timeConsts.MSEC_IN_SEC;
            vm.storage.stopwatch_seconds = Math.floor((vm.storage.stopwatch_counter / timeConsts.MSEC_IN_SEC )
                % timeConsts.SEC_IN_MIN);
            vm.storage.stopwatch_minutes = Math.floor((vm.storage.stopwatch_counter / timeConsts.MSEC_IN_MIN )
                % timeConsts.SEC_IN_MIN);
            vm.storage.stopwatch_hours = Math.floor((vm.storage.stopwatch_counter / timeConsts.MSEC_IN_HOUR ));
        }

        function start() {
            if (vm.storage.stopwatch_paused || !vm.storage.stopwatch_started)
            {
                if (!vm.storage.stopwatch_started)
                {
                    vm.storage.stopwatch_startTime = new Date().getTime();
                }
                else
                {
                    vm.storage.stopwatch_startTime = new Date().getTime() - vm.storage.stopwatch_counter;
                }
                vm.storage.stopwatch_started = true;
                vm.storage.stopwatch_paused = false;
                ticker = $timeout(vm.onTick, settings.TICK_STEP);
            }
        }

        function pause() {
            if (!vm.storage.stopwatch_paused)
            {
                $timeout.cancel(ticker);
                vm.storage.stopwatch_pausedTime = new Date().getTime();
                vm.storage.stopwatch_paused = true;
            }
        }

        function stop() {
            $timeout.cancel(ticker);
            vm.storage.stopwatch_hours = 0;
            vm.storage.stopwatch_minutes = 0;
            vm.storage.stopwatch_seconds = 0;
            vm.storage.stopwatch_milliseconds = 0;
            vm.storage.stopwatch_startTime = {};
            vm.storage.stopwatch_counter = 0;
            vm.storage.stopwatch_initialValue = 0;
            vm.storage.stopwatch_pausedTime = {};
            vm.storage.stopwatch_started = false;
            vm.storage.stopwatch_paused = false;
        }

        function restart() {
            vm.stop();
            vm.start();
        }
}})();