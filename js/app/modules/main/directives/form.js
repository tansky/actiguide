/**
 *  @ngdoc directive
 *  @name form
 *  @restrict E
 *
 *  @description Директива формы
 *
 *
 */
actiGuide.mainModule.directive('form', function () {
    return {
        require: 'form',
        restrict: 'E',
        link: function ($scope, $element, $attrs, formCtrl) {
            if (!formCtrl) return;

            angular.forEach(formCtrl, function(item) {
                if (angular.isObject(item) && item.$name) {
                    var control = $element.find('[name="' + item.$name + '"]');

                    item.$element = control;

                    control.on('focusout', checkControl);

                    control.on('keyup', function (){
                        if (!item.$error.showError) return;
                        checkControl();
                    });

                    function checkControl () {
                        var errorReason;
                        angular.forEach(item.$error, function(value, reason) {
                            if (value === true && reason !== 'required') {
                                errorReason = reason;
                            }
                        });

                        if (errorReason) {
                            $scope.$apply(item.$error.showError = errorReason);
                            $(this).addClass('invalid');
                        } else {
                            $scope.$apply(item.$error.showError = false);
                            $(this).removeClass('invalid');
                        }

                        if (item.$warnings) {
                            var warningReason;
                            angular.forEach(item.$warnings, function(value, reason) {
                                if (value === true) {
                                    warningReason = reason;
                                }
                            });

                            if (warningReason) {
                                $scope.$apply(item.$warnings.showWarning = warningReason);
                            } else {
                                $scope.$apply(item.$warnings.showWarning = false);
                            }
                        }
                    }
                }
            });
        },
    };
});
