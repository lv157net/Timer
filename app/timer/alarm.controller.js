/**
 * Created by Rostyslav on 22.10.2015.
 */
/**
 * Represents an alarm object
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
        .controller('AlarmController', AlarmController);

    AlarmController.$inject = ['$scope', '$timeout', '$localStorage', '$mdToast', 'timeConsts','settings'];

    function AlarmController($scope, $timeout, $localStorage, $mdToast, timeConsts, settings) {
        var vm = this;
        var ticker;
        vm.onTick = onTick;
        vm.restart = restart;
        vm.getToastPosition = getToastPosition;
        vm.pause = pause;
        vm.start = start;
        vm.stop = stop;
        vm.showToast = showToast;
        vm.isPauseDisabled = isPauseDisabled;
        vm.isStartDisabled = isStartDisabled;
        vm.isRestartDisabled = isRestartDisabled;

        vm.storage = $localStorage.$default({
            alarm_hours: 0,
            alarm_minutes: 0,
            alarm_seconds: 0,
            alarm_milliseconds: 0,
            alarm_ihours: 0,
            alarm_iminutes: 0,
            alarm_iseconds: 0,
            alarm_imilliseconds: 0,
            alarm_startTime: {},
            alarm_counter: 0,
            alarm_initialValue: 0,
            alarm_pausedTime: {},
            alarm_started: false,
            alarm_paused: false
        });

        vm.toastPosition = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        activate();

        function activate() {
            if(vm.storage.alarm_started && !vm.storage.alarm_paused) {
                onTick();
            }

            $scope.$on('$destroy', destroyHandler);
        }

        function isPauseDisabled() {
            return !vm.storage.alarm_started || vm.storage.alarm_paused;
        }

        function isStartDisabled() {
            return vm.storage.alarm_started && !vm.storage.alarm_paused;
        }

        function isRestartDisabled() {
            return !vm.storage.alarm_started;
        }

        function onTick() {
            //Perform a stopwatch_counter change depending on the object's type
            vm.storage.alarm_counter = vm.storage.alarm_initialValue
                - Math.abs(new Date().getTime()
                    - vm.storage.alarm_startTime);
            //Determine if the alarm has stopped
            if (vm.storage.alarm_counter > 0) {
                ticker = $timeout(vm.onTick, settings.TICK_STEP);
            }
            else {
                vm.stop();
                vm.showToast();
            }
            // Calculate ms/s/m/h values
            vm.storage.alarm_milliseconds = vm.storage.alarm_counter % timeConsts.MSEC_IN_SEC;
            vm.storage.alarm_seconds = Math.floor((vm.storage.alarm_counter / timeConsts.MSEC_IN_SEC )
                % timeConsts.SEC_IN_MIN);
            vm.storage.alarm_minutes = Math.floor((vm.storage.alarm_counter / timeConsts.MSEC_IN_MIN )
                % timeConsts.SEC_IN_MIN);
            vm.storage.alarm_hours = Math.floor((vm.storage.alarm_counter / timeConsts.MSEC_IN_HOUR ));
        }

        function start() {
            if (vm.storage.alarm_paused || !vm.storage.alarm_started) {
                if (!vm.storage.alarm_started) {
                    vm.storage.alarm_startTime = new Date().getTime();
                }
                else {
                    vm.storage.alarm_startTime += new Date().getTime() - vm.storage.alarm_pausedTime;
                }
                vm.storage.alarm_initialValue = vm.storage.alarm_ihours * timeConsts.MSEC_IN_HOUR
                    + vm.storage.alarm_iminutes * timeConsts.MSEC_IN_MIN
                    + vm.storage.alarm_iseconds * timeConsts.MSEC_IN_SEC
                    + vm.storage.alarm_imilliseconds;
                vm.storage.alarm_started = true;
                vm.storage.alarm_paused = false;
                ticker = $timeout(vm.onTick, settings.TICK_STEP);
            }
        }

        function pause() {
            if (!vm.storage.alarm_paused) {
                $timeout.cancel(ticker);
                vm.storage.alarm_pausedTime = new Date().getTime();
                vm.storage.alarm_paused = true;
            }
        }

        function stop() {
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
        }

        function restart() {
            vm.stop();
            vm.start();
        }

        function getToastPosition() {
            return Object.keys(vm.toastPosition)
                .filter(function (pos) {
                    return vm.toastPosition[pos];
                })
                .join(' ');
        }

        function showToast() {
            $mdToast.show(
                $mdToast.simple()
                    .content('Done with the alarm!')
                    .position(vm.getToastPosition())
                    .hideDelay(settings.TOASTR_DELAY)
            );
        }

        function destroyHandler() {
            $timeout.cancel(ticker);
        }
    }
})();