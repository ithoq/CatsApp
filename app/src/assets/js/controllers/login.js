angular.module('app').controller('LoginCtrl', ['$scope', '$state', '$http', 'localStorageService', function($scope, $state, $http, localStorageService) {

	$scope.login = {
        input: {
            username: '',
            password: ''
        }
    }

    $scope.submitLogin = function() {
        $scope.rest.login.post($scope.login.input, {format: 'json'}).then(function(credential) {
            console.log(credential);
            localStorageService.set('token', credential.key);
            localStorageService.set('email', credential.user.email);
            localStorageService.set('first_name', credential.user.first_name);
            localStorageService.set('last_name', credential.user.last_name);
            localStorageService.set('user_type', credential.user.user_type);
            localStorageService.set('username', credential.user.username);
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + credential.key;
			$state.go('app.dashboard');
        }, function(err) {
            console.log(err);
        });
    }

}]);