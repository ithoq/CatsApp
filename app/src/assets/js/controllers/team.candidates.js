'use strict';

/* Controllers */

angular.module('app').controller('TeamCandidatesCtrl', ['$scope', '$state', 'DTOptionsBuilder', 'DTColumnBuilder', '$mdDialog', function($scope, $state, DTOptionsBuilder, DTColumnBuilder, $mdDialog) {

	$scope.local = {
		options: DTOptionsBuilder.newOptions().withOption('colReorder', true).withOption('autoWidth', false),
		columns: [
			{name: 'current_status', selected: true, order: 0},
			{name: 'first_name', selected: true, order: 0},
			{name: 'date_created', selected: true, order: 0},
			{name: 'date_modified', selected: true, order: 0},
			{name: 'interview_comments_for_referals', selected: true, order: 0}
		],
		filterType: ['contains'],
		candidates: [],
		filter: []
	}

	$scope.rest.teamCandidates.getList({format: 'json'}).then(function(candidates) {
		console.log(candidates);
		$scope.local.candidates = candidates;
		angular.forEach(candidates, function(candidate) {
		//for (var i = 0; i < candidates.length; ++i) {
			angular.forEach(candidate, function(value, key) {
				if (key == 'contact')
					angular.forEach(candidate['contact'], function(value, key) {
						if (key != 'date_created' && key != 'date_modified' && key != 'is_active')
						candidate[key] = value;
					});
			});

			candidate.getList('status/', {format: 'json'}).then(function(status) {
				console.log(status);
				candidate['status'] = status;
			}, function(err) {

			});
		});
	}, function(err) {
		$state.go('login');
	});

	$scope.addFilter = function() {
		$scope.local.filter.push({col: '', type: '', input: ''});
		console.log($scope.local.filter);
	}

	$scope.removeFilter = function(index) {
		$scope.local.filter.splice(index, 1);
	}

	$scope.openDialog = function(event, status, current_status) {
		console.log(status, current_status);
		$mdDialog.show({
			templateUrl: '/tpl/dialog/status.html',
			controller: 'DialogStatusController',
			hasBackdrop: true,
			clickOutsideToClose: false,
			escapeToClose: true,
			parent: angular.element('body'),
			locals: {
				//candidate: candidate,
				status: status,
				current_status: current_status
			}
		});
	}

}]);

angular.module('app').controller('DialogStatusController', ['$scope', 'status', 'current_status', '$mdDialog', 'Restangular', function ($scope, status, current_status, $mdDialog, Restangular) {

	$scope.status = status;
	$scope.current_status = current_status;
	$scope.triggers = current_status['trigger'];

	$scope.$watch(function() {return $scope.current_status;}, function(val) {
		for (var i = 0; i < status.length; ++i) {
			if (status[i].pk == $scope.current_status.pk)
				$scope.triggers = $scope.status[i]['triggers'];
		}
		console.log(val, $scope.triggers);
	}, true);

	$scope.close = function() {
		$mdDialog.hide();
	};

	/*$scope.save = function() {
		Restangular.one('candidates/', $scope.current_status.pk)
	}*/
}]);

angular.module('app').filter('customFilter', function() {
	return function(input, filter) {

		if (filter.length == 0 || input.length == 0)
			return input;

		var out = [];

		for (var i = 0; i < input.length; ++i) {
			var test = true;
			for (var u = 0; u < filter.length; ++u) {
				if (filter[u].col != '' && filter[u].type != '' && filter[u].input != '') {
					if (filter[u].type == 'contains' && (input[i][filter[u].col] == null || input[i][filter[u].col].search(filter[u].input) == -1))
						test = false;
				}
			}
			if (test)
				out.push(input[i]);
		}

		return out;
	};
});

angular.module('app').directive('grip', function($parse) {
	return {
		restrict: 'AE',
		scope: {},
		link: function (scope, element, attrs) {
			scope.listen = false;
			scope.x = 0;

			var min = scope.min || 150;
			var minNext = scope.minNext || 150;
			
			if (attrs.classRef != undefined)
				scope.row = document.getElementsByClassName(attrs.classRef);
			else
				scope.row = document.getElementsByClassName('grip');

			element.bind("mousedown", function (event) {
                scope.listen = true;
            });
            angular.element('body').bind("mouseup", function (event) {
                scope.listen = false;
                scope.x = 0;
            });
            angular.element(element[0].parentElement.parentElement.parentElement).bind("mousemove", function (event) {
                if (scope.listen)
                {
                	event.preventDefault();
                	event.stopImmediatePropagation();
                	if (scope.x == 0)
                		scope.x = event.pageX;
                	else
                	{
                		var parent = element[0].parentElement.parentElement.parentElement;
                		var index = 0;
                		for (var i = 0; i < parent.children.length; ++i) {
                			if (parent.children[i] == element[0].parentElement.parentElement)
                				index = i;
                		}

						var currentRow = angular.element(scope.row[0].children[index]);
						var newCurrentWidth = parseInt(currentRow.css("width")) - (scope.x - event.pageX);
						currentRow.css("width",  newCurrentWidth + "px");

                		scope.x = event.pageX;
                	}
                }
            });
		}
	};
});