/**
 *  @ngdoc directive
 *  @name tabs
 *  @restrict E
 *
 *  @description Табы
 *
 *
 */
actiGuide.mainModule.directive('tabs', function (VIEWS_PATH, $timeout, layers) {
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

                $timeout(function (){
                    $('button', $element).each(function (index, item){
                        var width = $(item).outerWidth();
                        elementsWidthArray.push({
                            element: item,
                            width: width,
                            hidden: false
                        });
                    });

                    var length = elementsWidthArray.length,
                        btnMoreWidth = $('.fake-btn',$element).outerWidth();

                    calculateTabsWidth();

                    $(window).on('resize', function () {
                        calculateTabsWidth();
                        $scope.$apply();
                    });

                    $scope.checkHiddenList = function (){
                        return $scope.hiddenList.some(function (item){
                            return item.selected;
                        });
                    };

                    $scope.selectHiddenItem = function (){
                        layers.popLastLayer();
                    };

                    function calculateTabsWidth () {

                        $scope.hiddenList = [];
                        elementsWidth = 0;
                        boxWidth = $element.width();

                        angular.forEach(elementsWidthArray, function (item){
                            item.hidden = false;
                            elementsWidth += item.width;
                        });

                        elementsWidth += btnMoreWidth;

                        if (elementsWidth > boxWidth) {
                            var i = 1;

                            elementsWidthArray[length - i].hidden = true;
                            i++;
                            elementsWidthArray[length - i].hidden = true;

                            elementsWidth = 0;
                            angular.forEach(elementsWidthArray, function (item){
                                if (!item.hidden) {
                                    elementsWidth += item.width;
                                }
                            });
                            elementsWidth += btnMoreWidth;

                            while (elementsWidth > boxWidth) {
                                elementsWidth = 0;
                                elementsWidthArray[length - i++].hidden = true;
                                angular.forEach(elementsWidthArray, function (item){
                                    if (!item.hidden) {
                                        elementsWidth += item.width;
                                    }
                                });
                                elementsWidth += btnMoreWidth;
                            }
                        }

                        angular.forEach($scope.tabs, function(item, index){
                            item.hidden = elementsWidthArray[index].hidden;

                            if (item.hidden) {
                                $scope.hiddenList.push(item);
                            }
                        });

                    };
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
