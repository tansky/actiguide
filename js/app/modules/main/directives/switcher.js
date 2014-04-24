/**
 *  @ngdoc directive
 *  @name switcher
 *  @restrict A
 *
 *  @description Переключатели
 *
 *
 */
actiGuide.mainModule.directive('switcher', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            modelValue: '=ngModel'
        },
        controller: function ($scope, $element, $attrs) {
            var items = $scope.items = [];

            this.select = function (item) {
                angular.forEach(items, function (item) {
                    item.selected = false;
                });
                item.selected = true;

                if (angular.isDefined(item.modelValue)) {
                    $scope.modelValue = item.modelValue;

                } else if (item.handler) item.handler();
            };

            $scope.selectByValue = function () {
                var currentItem;
                angular.forEach(items, function (item) {
                    item.selected = false;

                    if (item.modelValue === 'true') item.modelValue = true;
                    if (item.modelValue === 'false') item.modelValue = false;

                    if (item.modelValue === $scope.modelValue) currentItem = item;
                });

                if (currentItem) {
                    currentItem.selected = true;
                    if (currentItem.handler) currentItem.handler();
                }
            };

            this.addItem = function (item, element, isDefault) {
                if (items.length == 0) this.select(item);
                if (isDefault) this.select(item);
                items.push(item);
            };
        },
        link: function($scope, $element, $attrs) {
            if ($attrs.ngModel) {
                $scope.$watch('modelValue', function(newValue) {
                    $scope.selectByValue();
                });
            }
        },
        template: '<div class="tab-btn-box" data-ng-transclude></div>',
        replace: true
    };
}).directive('item', function () {
    return {
        require: '^switcher',
        restrict: 'E',
        transclude: true,
        scope: {
            handler: '&',
            isDefault: '@',
            modelValue: '@'
        },
        link: function (scope, element, attrs, switcherCtrl) {
            switcherCtrl.addItem(scope, attrs.isDefault);

            scope.select = switcherCtrl.select;
        },
        template: '<button class="tab-btn" data-ng-class="{ active: selected }" data-ng-click="select(this)" data-ng-transclude></button>',
        replace: true
    };
});
