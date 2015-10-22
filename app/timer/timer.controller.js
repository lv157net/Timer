/**
 * Created by Rostyslav on 22.10.2015.
 */
/**
 * Represents a timer object
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

(function () {
    'use strict';
    angular
        .module('TimingApp')
        .controller('TimerController', TimerController);

    TimerController.$inject = ['$timeout', '$localStorage', 'timeConsts', 'settings'];

    function TimerController($timeout, $localStorage, timeConsts, settings) {
        var vm = this;
        var ticker;
        vm.start = start;
        vm.stop = stop;
        vm.restart = restart;
        vm.onTick = onTick;
        vm.pause = pause;
        vm.isPauseDisabled = isPauseDisabled;
        vm.isStartDisabled = isStartDisabled;
        vm.isRestartDisabled = isRestartDisabled;

        vm.storage = $localStorage.$default({
            timer_hours: 0,
            timer_minutes: 0,
            timer_seconds: 0,
            timer_milliseconds: 0,
            timer_ihours: 0,
            timer_iminutes: 0,
            timer_iseconds: 0,
            timer_imilliseconds: 0,
            timer_startTime: {},
            timer_counter: 0,
            timer_initialValue: 0,
            timer_pausedTime: {},
            timer_started: false,
            timer_paused: false
        });

        activate();

        function activate() {
            if(vm.storage.timer_started && !vm.storage.timer_paused) {
                onTick();
            }

            onTick();
        }

        function isPauseDisabled() {
            return !vm.storage.timer_started || vm.storage.timer_paused;
        }

        function isStartDisabled() {
            return vm.storage.timer_started && !vm.storage.timer_paused;
        }

        function isRestartDisabled() {
            return !vm.storage.timer_started;
        }

        function onTick() {
            //Perform a stopwatch_counter change depending on the object's type
            vm.storage.timer_counter = vm.storage.timer_initialValue
                - Math.abs(new Date().getTime()
                    - vm.storage.timer_startTime);
            //Determine if the timer has stopped
            if (vm.storage.timer_counter > 0) {
                ticker = $timeout(vm.onTick, settings.TICK_STEP);
            }
            else {
                vm.stop();
            }
            // Calculate ms/s/m/h values
            vm.storage.timer_milliseconds = vm.storage.timer_counter % timeConsts.MSEC_IN_SEC;
            vm.storage.timer_seconds = Math.floor((vm.storage.timer_counter / timeConsts.MSEC_IN_SEC )
                % timeConsts.SEC_IN_MIN);
            vm.storage.timer_minutes = Math.floor((vm.storage.timer_counter / timeConsts.MSEC_IN_MIN )
                % timeConsts.SEC_IN_MIN);
            vm.storage.timer_hours = Math.floor((vm.storage.timer_counter / timeConsts.MSEC_IN_HOUR ));
        }

        function start() {
            if (vm.storage.timer_paused || !vm.storage.timer_started) {
                if (!vm.storage.timer_started) {
                    vm.storage.timer_startTime = new Date().getTime();
                }
                else {
                    vm.storage.timer_startTime += new Date().getTime() - vm.storage.timer_pausedTime;
                }
                vm.storage.timer_initialValue = vm.storage.timer_ihours * timeConsts.MSEC_IN_HOUR
                    + vm.storage.timer_iminutes * timeConsts.MSEC_IN_MIN
                    + vm.storage.timer_iseconds * timeConsts.MSEC_IN_SEC
                    + vm.storage.timer_imilliseconds;
                vm.storage.timer_started = true;
                vm.storage.timer_paused = false;
                ticker = $timeout(vm.onTick, settings.TICK_STEP);
            }
        }

        function pause() {
            if (!vm.storage.timer_paused) {
                $timeout.cancel(ticker);
                vm.storage.timer_pausedTime = new Date().getTime();
                vm.storage.timer_paused = true;
            }
        }

        function stop() {
            $timeout.cancel(ticker);
            vm.storage.timer_hours = 0;
            vm.storage.timer_minutes = 0;
            vm.storage.timer_seconds = 0;
            vm.storage.timer_milliseconds = 0;
            vm.storage.timer_startTime = {};
            vm.storage.timer_counter = 0;
            vm.storage.timer_initialValue = 0;
            vm.storage.timer_pausedTime = {};
            vm.storage.timer_started = false;
            vm.storage.timer_paused = false;
        }

        function restart() {
            vm.stop();
            vm.start();
        }
    }
})();