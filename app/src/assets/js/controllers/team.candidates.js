'use strict';

/* Controllers */

angular.module('app').controller('TeamCandidatesCtrl', ['$scope', '$state', 'DTOptionsBuilder', function($scope, $state, DTOptionsBuilder) {

	$scope.local = {
		options: DTOptionsBuilder.newOptions(),
		columns: ['date_created', 'date_modified'],
		candidates: []
	}


	$scope.rest.teamCandidates.getList({format: 'json'}).then(function(candidates) {
		console.log(candidates);
		$scope.local.candidates = candidates;
	}, function(err) {
		$state.go('login');
	});

}]);