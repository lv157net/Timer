/**
 * Created by Rostyslav on 22.10.2015.
 */

angular
    .module('TimingApp', ['ngMaterial', 'ngStorage'])
    .constant('timeConsts', {
        MSEC_IN_SEC: 1000,
        SEC_IN_MIN: 60,
        MSEC_IN_MIN: 1000 * 60,
        MSEC_IN_HOUR: 1000 * 60 * 60
    })
    .constant('settings', {
        TOASTR_DELAY: 1500,
        TICK_STEP: 50
    });