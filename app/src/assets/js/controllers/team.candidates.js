'use strict';

/* Controllers */

angular.module('app').controller('TeamCandidatesCtrl', ['$scope', '$state', 'DTOptionsBuilder', 'DTColumnBuilder', function($scope, $state, DTOptionsBuilder, DTColumnBuilder) {

	$scope.local = {
		options: DTOptionsBuilder.newOptions().withOption('colReorder', true).withOption('autoWidth', false),
		columns: [
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
		for (var i = 0; i < candidates.length; ++i) {
			angular.forEach(candidates[i], function(value, key) {
				if (key == 'contact')
					angular.forEach(candidates[i]['contact'], function(value, key) {
						if (key != 'date_created' && key != 'date_modified' && key != 'is_active')
						candidates[i][key] = value;
						//$scope.local.columns.push({name: key2, selected: true, order: 0});

					});
				//else
					//$scope.local.columns.push({name: key, selected: true, order: 0});
			});
		}
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