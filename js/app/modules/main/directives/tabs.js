/**
 *  @ngdoc directive
 *  @name hint
 *  @restrict A
 *
 *  @description Табы
 *
 *
 */
actiGuide.mainModule.directive('tabs', function (VIEWS_PATH, $timeout) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            modelValue: '=ngModel'
        },
        controller: function ($scope, $element, $attrs) {
            var tabs = $scope.tabs = [],
                tabElements = $scope.tabElements = [];

            $scope.select = function (tab) {
                angular.forEach(tabs, function (tab) {
                    tab.selected = false;
                });
                tab.selected = true;

                if (angular.isDefined(tab.modelValue)) {
                    $scope.modelValue = tab.modelValue;

                } else if (tab.handler) tab.handler();
            };

            $scope.selectByValue = function () {
                var tab;
                angular.forEach(tabs, function (item) {
                    item.selected = false;

                    if (item.modelValue === 'true') item.modelValue = true;
                    if (item.modelValue === 'false') item.modelValue = false;

                    if (item.modelValue === $scope.modelValue) tab = item;
                });

                if (tab) {
                    tab.selected = true;
                    if (tab.handler) tab.handler();
                }
            };

            this.addTab = function (tab, element, isDefault) {
                if (tabs.length == 0) $scope.select(tab);
                if (isDefault) $scope.select(tab);
                tabs.push(tab);
                tabElements.push(element);
            };
        },
        link: function($scope, $element, $attrs) {
            if ($attrs.ngModel) {
                $scope.$watch('modelValue', function(newValue) {
                    $scope.selectByValue();
                });
            }

            console.log($scope.tabElements);

            $('button', $element).each(function (index, item) {
                console.log($(item).width());
            });
        },
        templateUrl: VIEWS_PATH + 'tabs.html',
        replace: true
    };
}).directive('tab', function () {
    return {
        require: '^tabs',
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@',
            handler: '&',
            isDefault: '@',
            modelValue: '@'
        },
        link: function (scope, element, attrs, tabsCtrl) {
            tabsCtrl.addTab(scope, element, attrs.isDefault);
        },
        template: '<div data-ng-show="selected" data-ng-transclude></div>',
        replace: true
    };
});
