/**
 *  @ngdoc filter
 *  @name getDigits
 *
 *  @description Вырезает из строки все кроме цифр
 *
 */
actiGuide.mainModule.filter('getDigits', function() {
    return function(value) {
        if (!value || !String(value).match(/\d/g)) return value;
        return String(value).match(/\d/g).join('') || '';
    };
})