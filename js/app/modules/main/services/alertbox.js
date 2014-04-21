actiGuide.mainModule.service('alertBox', ['$animate', function ($animate) {
	var alertBoxes = [];

	return {
		push: function(text, config) {
			var additionalClasses = '';

			if (!config) {
				config = {};
			}

			if (document.getElementsByClassName('alert-box-wrap').length === 0) {
				angular.element(document.getElementsByTagName('BODY')).append('<div class="alert-box-wrap">');
			}

			if (config.color) {
				additionalClasses += ' ' + config.color;
			}

			var element = angular.element('<div class="alert-box' + additionalClasses + '">' + text + '</div>');
			angular.element(document.getElementsByClassName('alert-box-wrap')).append(element);

			console.log('push', text, config)
		}
	}
}]);