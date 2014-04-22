actiGuide.mainModule.service('alertBox', function ($timeout) {
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

			if (config.target) {
				angular.element(document.getElementById(config.target)).html(element);
			} else {
				angular.element(document.getElementsByClassName('alert-box-wrap')).append(element);
			}

			$timeout(function() {
				element.addClass('opened');
			});

			var timeout = $timeout(function() {
				angular.element(element).removeClass('opened')
			}, config.timeout ? config.timeout : 3000);

			element.on('mouseover', function() {
				$timeout.cancel(timeout);
			});

			element.on('mouseout', function() {
				timeout = $timeout(function() {
					angular.element(element).removeClass('opened')
				}, config.timeout ? config.timeout : 3000);
			});
		}
	}
});