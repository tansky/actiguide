/**
 *  @ngdoc directive
 *  @name splitFields
 *  @restrict A
 *
 *  @description Директива для сплит полей. Вешается на родителя. Между полями можно переходить с помощью стрелок влево/вправо.
 *
 */
actiGuide.mainModule.directive('splitFields', function ($caretPosition, $timeout) {
    return {
        restrict: 'A',
        priority: 900,
        link: function (scope, element, attrs) {
            var fields = element.find('input:visible');

            if (fields.length < 2) return;

            //управление стрелками
            fields.each(function (index, item) {
                $(item).on('keydown', function (event) {
                    var key = event.keyCode,
                        caretPosition = $caretPosition.get(this),
                        valueLength = this.value.length;

                    if (key == 39 && caretPosition == valueLength && fields[index + 1]) {
                        $timeout(function() {
                            $caretPosition.set(fields[index + 1], 0);
                        }, 1);
                    }
                    if (key == 37 && caretPosition == 0 && fields[index - 1]) {
                        $timeout(function () {
                            $caretPosition.set(fields[index - 1], fields[index - 1].value.length);
                        }, 1);
                    }
                });

                var maxlength = $(this).attr('maxlength');
                if(maxlength) {
                    $(item).on('keyup', function (event) {
                        var key = event.keyCode;

                        if (key == 39 || key == 37) return;

                        if (maxlength == $(this).val().length && fields[index + 1]) {
                            $timeout(function() {
                                $caretPosition.set(fields[index + 1], 0);
                            }, 1);
                        }
                    });
                }
            });
        }
    };
});