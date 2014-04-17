/**
 *  @ngdoc directive
 *  @name validationTip
 *  @restrict A
 *
 *  @description Директива вешается на кнопку submit. При клике на кнопку показывается подсказка о невалидных полях и ставится фокус в первое невалидное поле
 *
 */
actiGuide.mainModule.directive('validationTip', function () {
    return {
        restrict: 'A',
        link: function ($scope, $element) {
            var parent = $element.parents('form').get(0) || $element.parents('.popup-modal').get(0) || $('body');
            $element.on('click', function() {
                $scope.$apply($scope.showTip = true);
                $('input.ng-invalid, textarea.ng-invalid, div.ng-invalid:not(.disabled) input', parent).not(':hidden, .disabled').first().focus();
            });
        }
    };
});

/**
 *  @ngdoc directive
 *  @name validationTip
 *  @restrict E
 *
 *  @description Подсказка о невалидных полях формы
 *
 */
actiGuide.mainModule.directive('validationTip', function (VIEWS_PATH) {
    return {
        priority: 900,
        require: '^form',
        scope: true,
        restrict: 'E',
        replace: true,
        link: function ($scope, $element, $attrs, formCtrl) {
            if (!formCtrl) return;

            $scope.tips = $scope.tips ? $scope.tips : [];

            angular.forEach(formCtrl, function(item) {
                if (angular.isObject(item) && item.$name) {
                    var tipText = item.$element ? item.$element.data('val-tip') : null;

                    if (tipText) {
                        $scope.tips.push({
                            $elName: item.$name,
                            $element: item.$element,
                            title: tipText,
                            showTip: item.$invalid
                        });

                        var currentIndex = $scope.tips.length - 1;

                        $scope.$watch(formCtrl.$name + '.' + item.$name + '.$invalid', function(newValue, oldValue) {
                            $scope.tips[currentIndex].showTip = newValue;

                            var isInvalid = false;
                            angular.forEach($scope.tips, function(tip) {
                                if (tip.showTip === true) {
                                    isInvalid = true;
                                }
                            });

                            $scope.isInvalid = isInvalid;
                        });
                    }
                }
            });

            $scope.$on('tipsChanged', function() {
                var isInvalid = false;
                angular.forEach($scope.tips, function(tip) {
                    if (tip.showTip === true) {
                        isInvalid = true;
                    }
                });

                $scope.isInvalid = isInvalid;
            });

            $scope.focusTo = function(tip) {
                if (tip.href) {
                    $scope[tip.href]($scope.popup);
                    return;
                }

                if (!tip.$element) return;

                angular.isString(tip.$element) ? $(tip.$element).first().focus() : tip.$element.focus();
            };
        },
        templateUrl: VIEWS_PATH + 'validationtip.html'
    };
});
