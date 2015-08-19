var app = angular.module('TimingApp', ['ngMaterial']);

app.controller('NavbarCtrl', function($scope) {
    "use strict";
    $scope.isOpen = true;
    $scope.count = 3;
});