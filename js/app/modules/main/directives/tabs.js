/**
 *  @ngdoc directive
 *  @name tabs
 *  @restrict E
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
            var tabs = $scope.tabs = [];

            $scope.select = function (tab) {
                angular.forEach(tabs, function (tab) {
                    tab.selected = false;
                });
                tab.selected = true;

                if (tab.handler) tab.handler();
            };

            this.addTab = function (tab, element, isDefault) {
                if (tabs.length == 0) $scope.select(tab);
                if (isDefault) $scope.select(tab);
                tabs.push(tab);
            };
        },
        link: function($scope, $element, $attrs) {
            if ($element.hasClass('nav-tabs')) {

                var boxWidth = $element.width(),
                    elementsWidthArray = [],
                    elementsWidth = 0;

                console.log($scope.tabs);

                $timeout(function (){
                    $('button', $element).each(function (index, item){
                        var width = $(item).outerWidth();
                        elementsWidthArray.push({
                            element: item,
                            width: width,
                            hidden: false
                        });

                        elementsWidth += width;
                    });

                    if (elementsWidth > boxWidth) {
                        var length = elementsWidthArray.length;

                        elementsWidthArray[length - 1].hidden = true;
                        elementsWidthArray[length - 2].hidden = true;

                        elementsWidth = 0;
                        angular.forEach(elementsWidthArray, function (item){
                            if (!item.hidden) {
                                elementsWidth += item.width;
                            }
                        });

                        console.log($('.dropdown', $element));

                        console.log(boxWidth, elementsWidth, elementsWidthArray);

                        angular.forEach($scope.tabs, function(item, index){
                            item.hidden = elementsWidthArray[index].hidden;
                        });
                    }
                });

            }
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
            tabsCtrl.addTab(scope, attrs.isDefault);
        },
        template: '<div data-ng-show="selected" data-ng-transclude></div>',
        replace: true
    };
});
