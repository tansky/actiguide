/**
 *  @ngdoc directive
 *  @name btn__select
 *  @restrict С
 *
 *  @description Кнопка с выпадающим списком
 *
 */
actiGuide.mainModule.directive('btnSelect', function () {

    var $btnsList = $();

    $(document).on('click', function () {
        $btnsList.removeClass('active').find('.select-dropdown').hide();
    });

	return {
		restrict: 'C',
		link: function (scope, element, attr) {
            $btnsList = $btnsList.add(element);

            var dropdown = $('.select-dropdown', element);

            element.on('click', function (event) {
                if (element.hasClass('active')) {
                    dropdown.hide();
                } else {
                    event.stopPropagation();
                    $btnsList.removeClass('active').find('.select-dropdown').hide();
                    dropdown.show();
                }
                element.toggleClass('active');
            });
		}
	};
});
