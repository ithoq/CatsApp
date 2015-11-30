var app = angular.module('ignition', ['ngRoute']);

/*angular.element(document).ready(function() {
	angular.bootstrap(document, ['ignition']);
});*/

angular.module('ignition').controller('AppCtrl', ['$scope', '$location', function($scope, $location) {

	$scope.global = {
		hideMenu: true,
		path: '/'
	}

	$scope.$watch(function() {return $location.path();}, function(path) {
		$scope.global.path = path;
		if (path == "/")
			$scope.global.hideMenu = true;
		else
			$scope.global.hideMenu = false;
	});

	$scope.goTo = function(path) {
		$location.path(path);
	}
}]);