(function(){
	app.controller('MainController', ['$scope', '$sce', '$location', '$templateCache', '$timeout',
		function ($scope, $sce, $location, $templateCache, $timeout) {
		$scope.showSidebar = false;		
		$scope.menuItem = 'menu';
		$scope.stopAudio = false;		
		
		$scope.$on('$routeChangeStart', function(next, current) {		   
		   	var currenlocation = $location.url();		   
		   	$scope.activeSubNav = currenlocation.slice(1).split('/')[0];		   	
		   	$scope.quickMenuItem = (currenlocation.slice(1).split('/')[1] && currenlocation.slice(1).split('/')[1] !== 'genres') ? 'back_arrow' : 'menu';
		   	$scope.playerType = (currenlocation.slice(1).split('/')[1] === 'audioplayer') ? 'large' : 'small';
		   	$scope.windowHeight = ($scope.showSidebar) ? $( window ).height() + 85 : $( window ).height();
		    if (typeof(current) !== 'undefined'){
	            $templateCache.remove(current.templateUrl);
	    	}
	    	$('#slaask-button').addClass('hide');
		});

		$scope.$on('stopAudio', function(next, current) {
			$scope.$broadcast('stoppingAudio');
		});

		$scope.closeSideBar = function(){
			$scope.showSidebar = false;
		}

		$scope.quickMenu = function(item){
			if(item === 'menu' || item === 'genres'){
				$scope.showSidebar = !$scope.showSidebar;
				$('#slaask-button').toggleClass('hide');			
			}
			else{
				window.history.back();
			}
		};

		$timeout(function() {
            $('#slaask-button').addClass('hide');
        }, 1000);
		
		
    }]);
})();