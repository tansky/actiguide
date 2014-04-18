/**
 *  @ngdoc service
 *  @name ranges
 *
 *  @description
 *  Сервис работы с периодами. Фундамент "умного календаря".
 *  Используется в директиве datepicker для получения заблокированных/активных периодов.
 *  К нему возможно получить доступ из любого контроллера для реализации сложных блокировок.
 */

;(function (ng, app) {

    /**
     * @author Vitaly Gridnev
     */

    app.service( 'ranges', ['$rootScope', function ($rootScope) {
        return new RangesService( $rootScope )
    } ] );

    var DATE_FORMAT = 'D.M.YYYY',// moment.js date format
        RANGE_TYPES = {},
        TODAY = moment();

    var RangesService = function ($scope) {

        var RANGES = [],
            DATEPICKERS = [],
            RANGE_MIN_VAL = moment( '01.01.1970', DATE_FORMAT ),
            RANGE_MAX_VAL = moment( '01.01.2100', DATE_FORMAT );


        /**
         * Добавляет период в сервис
         *
         * @param {Range} range
         * @returns {Range}
         */
        function addRange (range) {

            RANGES.push( range )
            return range

        }


        /**
         * Получение активного периода для конкретного дейтпикера
         *
         * @param datepicker имя дейтпикера
         * @param [date_selected] признак поиска активного периода, в который входит переданная дата
         * @returns {Range}
         */
        function getActiveRangeForDatepicker (datepicker, date_selected) {

            var _ranges = getRangesForDatepicker( datepicker ),
                date_selected = !!date_selected ? moment( date_selected, DATE_FORMAT ).toDate() : false,
                result = {
                    //from: RANGE_MIN_VAL.clone(),
                    //to: RANGE_MAX_VAL.clone()
                };


            _ranges.sort( function ( a, b ){
                return b.to.diff(b.from) > a.to.diff(a.from) ;
            })


            var __ranges = _ranges;

            for ( var i = 0, till = _ranges.length; i<_ranges.length; i++ ){

                var range1 = _ranges[i];

                for ( var j = i+1; j < till; j++ ){
                    var range2 = _ranges[j];

                    if ((range2.from.isSame(range1.from) || range2.from.isAfter(range1.from)) && (range2.to.isSame(range1.to) || range2.to.isBefore(range1.to))) {
                        __ranges = _.without(__ranges, range2);
                    }

                }


            }

            _ranges = __ranges;

            _ranges.sort( function (a, b) {

                var result = 0;

                if ( a.from.diff( b.from ) < 0 ) {
                    result = -1;
                } else if ( a.from.isSame( b.from ) ) {
                    if ( a.to.diff( b.to ) < 0 ) {
                        result = -1
                    } else
                        result = 1
                } else {
                    result = 1;
                }

                return result
            } )

            if ( date_selected ){
                if ( !_ranges[0].from.isSame( RANGE_MIN_VAL ) ) { // если период не сначала
                    if ( date_selected > RANGE_MIN_VAL.toDate() && date_selected < _ranges[0].from.toDate() ) { // если дата между минимумом и началом периода
                        result.from = RANGE_MIN_VAL.clone()
                        result.to = _ranges[0].from.clone();
                        return result;
                    }
                }
            }

            for ( var i = 0, till = _ranges.length - 1; i < till; i++ ) {

                var range1 = _ranges[i],
                    range2 = _ranges[i + 1];

                if ( range1.to.diff( range2.from ) < 0 ) { // если между ними есть разрыв
                    if ( date_selected ) {
                        if ( date_selected >= range1.to.toDate() && date_selected <= range2.from.toDate() ) { // если искомая дата входит в разрыв
                            result.from = range1.to;
                            result.to = range2.from;
                            break;
                        } else {
                            result.from = range2.to;
                        }
                    } else {
                        result.from = range1.to;
                        result.to = range2.from;
                        break;
                    }
                } else { // если нет разрыва
                    if ( range1.to.diff( range2.to ) < 0 ) { // если конец второго позже конца первого
                        result.from = range2.to;
                    } else {
                        if ( range1.from.diff( range2.from) < 0 ){
                            result.from = range1.to;
                        } else {
                            result.from = range2.to;
                        }
                    }
                }
            }


            result.from =  !!result.from ? result.from.clone() : RANGE_MIN_VAL.clone()
            result.to =  !!result.to ? result.to.clone() : RANGE_MAX_VAL.clone()

            return result
        }

        /**
         * Оповещаем об изменениях
         */
        function broadcastChange () {
            $scope.$broadcast( 'RangesChanged' )
        }


        function removeRange (range) {
            RANGES.splice( RANGES.indexOf( range ), 1 );
        }


        /**
         * сбросить периоды
         * @param {String} [type] название типа
         */
        function flush(type) {

            type = !!type ? type : undefined;

            var rangesToFlush = [];

            if (type) {

                rangesToFlush = _.filter(RANGES, function (range) {
                    return range.type == type
                });

                _.each(rangesToFlush, function (range) {
                    range.remove()
                })

            } else {
                // удаляем всё, кроме дефолтных ограничений
                var rangesToFlush = _.filter(RANGES, function (range) {
                    return range.type !== 'default'
                })

                _.each(rangesToFlush, function (range) {
                    range.remove()
                });

                broadcastChange();
            }
        }


        function getRangesForDatepicker (name) {

            var result = [];

            _.each( RANGES, function (range) {
                if ( !/datepicker/.test( range.type ) ) {
                    result.push( range )
                } else {
                    if ( range.type == 'datepicker_' + name ) {

                        if ( range.from === null ) {
                            range.from = RANGE_MIN_VAL.clone()
                        }

                        if ( range.to === null ) {
                            range.to = RANGE_MAX_VAL.clone();
                        }

                        result.push( range )
                    }
                }
            } )

            return result;
        }

        function isDateSelectable (date) {

            var datepicker = this,
                result = {
                    selectable: true,
                    message: ''
                },
                date = moment( date ),
                rangesToCheck = getRangesForDatepicker( datepicker );

            for ( var i in rangesToCheck ) {

                var range = rangesToCheck[i],
                    _d = date.toDate(),
                    _f = range.from.toDate(),
                    _t = range.to.toDate();

                if ( _d >= _f && _d <= _t ) {
                    result.selectable = false;
                    result.message = range.message;

                    break;
                }

            }

            return result;
        }


        /**
         * Создание зависимого периода
         * не отличается ничем, кроме типа, который устанавливается в 'datepicker_'+type
         *
         * @param from
         * @param to
         * @param type
         * @param message
         * @returns {Range}
         */
        function createDependentRange (from, to, type, message) {

            var range = createRange( from, to, type, message );

            range.type = 'datepicker_' + type;

            return range
        }


        /**
         * Парсинг даты
         * @param {Variant} obj может быть строкой, стампом с бэкэнда или объектом Moment JS
         * @returns {Moment}
         */
        function parseDate (obj) {

            if ( obj === null ) {
                return ''
            }

            // если строка
            if ( typeof obj == 'string' ) {

                var backendStampExp = /^\/Date\((\d+)\)\/$/, dependenceStampExp = /(\d+).(\d+).(\d+)/, date;

                if ( backendStampExp.test( obj ) ) {
                    date = new Date( parseInt( obj.match( backendStampExp )[1], 10 ) )
                } else if ( dependenceStampExp.test( obj ) ) {
                    var matches = obj.match( dependenceStampExp );
                    date = new Date( matches[3], matches[2] - 1, matches[1] )
                }
                return moment( new Date( date ) ).startOf( 'day' )
            }

            if ( moment.isMoment( obj ) ) {
                return obj.startOf( 'day' )
            }

            return ''
        }


        /**
         * Создаёт период
         *
         * @param {Variant} from дата начала, либо null, либо /Date/, либо moment
         * @param {Variant} to дата конца, либо null, либо /Date/, либо moment
         * @param {String} type тип периода
         * @param {String} message сообщение периода
         * @returns {Range}
         */
        function createRange (from, to, type, message) {


            var from = parseDate( from ),
                to = parseDate( to ),
                type = type,
                message = message;

            from = from == '' ? RANGE_MIN_VAL.clone() : from;
            to = to == '' ? RANGE_MAX_VAL.clone() : to;

            return {
                from: from,
                to: to,
                type: type,
                message: message,
                remove: function () {
                    removeRange( this )
                }
            }

        }

        /**
         * Понимает формат периодов с бэкэнда
         * Возвращает стандартный период
         *
         * @param _arr период с бэкэнда
         * @returns {Range}
         */
        function createBackendRange (_arr) {

            var from = _arr.DateStart,
                to = _arr.DateEnd,
                message = _arr.Reason;

            return createRange( from, to, 'backend', message )
        }


        /**
         * Возвращает весь список периодов
         * Для какого-нибудь хардкодинга
         *
         * @returns {Ranges[]}
         */
        function getList () {
            return RANGES;
        }


        /**
         * Добавляет в сервис ограничения по умолчанию
         */
        function addDefaultBounds () {

            var bounds = [];

            for ( var bound in bounds ) {
                addRange( bounds[bound] )
            }
        }


        function init () {

            addDefaultBounds()

            /**
             * @class RangesService
             * @constructor
             */
            return {
                addRange: addRange,
                removeRange: removeRange,
                createRange: createRange,
                createBackendRange: createBackendRange,
                broadcastChange: broadcastChange,
                getRangesForDatepicker: getRangesForDatepicker,
                getActiveRangeForDatepicker: getActiveRangeForDatepicker,
                createDependentRange: createDependentRange,
                isDateSelectable: isDateSelectable,
                flush: flush,
                getList: getList
            }
        }

        return init()
    }

}( angular, actiGuide.mainModule ));