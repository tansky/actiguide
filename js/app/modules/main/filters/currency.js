/**
 *  @ngdoc filter
 *  @name currency
 *
 *  @description Разбивает число по разрядам и округляет до второго знака
 *
 */
actiGuide.mainModule.filter('currency', function() {
    return function(value, format) {
        if (!value) return value;
        value = String(value).replace(',', '.');
        value = Math.ceil(value * 100) / 100;
        value = String(value).split('.');
        if (value[1]) {
            value[1] = value[1].length == 1 ? value[1] + '0' : value[1]; //если пришло число типа 1.2, добавляем к копейкам ноль
        }
        if (format === 'full') {
            return value[0].replace(/(\d)(?=(?:\d{3})+$)/g, "$1 ") + ' руб' + (+value[1] ? ' ' + value[1] + ' коп' : "");
        }
        return value[0].replace(/(\d)(?=(?:\d{3})+$)/g, "$1 ") + (+value[1] ? "," + value[1] : "");
    };
})