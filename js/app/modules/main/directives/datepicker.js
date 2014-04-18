/**
 *  @ngdoc directive
 *  @name datepicker
 *  @restrict E
 *
 *  @description
 *  Директива календаря для выбора дат с поддержкой периодов
 */
;actiGuide.mainModule.directive( 'datepicker', [ 'ranges', 'VIEWS_PATH', function ( RangesService, VIEWS_PATH) {

    return {
        restrict: 'E',
        scope: {
            mDate: '=' // дата в формате 1.1.2000
        },
        replace: true,
        transclude: false,
        templateUrl: VIEWS_PATH + 'datepicker.html',
        link: function ($scope, $element, $attrs) {

            var TODAY = new Date(),
                RENDER_DATE = TODAY,
                DATE_SELECTED = TODAY;

            $scope.isDisableBtn = false;
            $scope.RangesService = RangesService;
            $scope.bindedTo = !!$attrs.alternativeBinding ? $attrs.alternativeBinding : $attrs.mDate;
            $scope.inputValue = {
                day: parseInt( TODAY.getDay(), 10 ),
                month: parseInt( TODAY.getMonth(), 10 ),
                year: parseInt( TODAY.getFullYear(), 10 )
            };
            $scope.showSubmitTooltip = false;
            $scope.submitTooltip = '';
            $scope.week = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
            $scope.month = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];


            /**
             * День недели
             * @param date
             * @returns {number}
             */
            function getDayOfWeek (date) {
                var day = date.getDay();
                if ( day == 0 ) day = 7;
                return day - 1;
            }


            /**
             * Количество дней в месяце
             * @param date
             * @returns {number}
             */
            function daysInMonth (date) {
                return 33 - new Date( date.getFullYear(), date.getMonth(), 33 ).getDate();
            }


            /**
             * Проверки вводимых символов из инпутов
             * @param $scope
             * @param inputValue
             */
            function checkInputsValue ($scope, inputValue) {

                var _inputValue = _.clone( inputValue );

                if ( _inputValue.year.length < 4 ){
                    return;
                }

                _inputValue.month = parseInt( _inputValue.month, 10 ) == 0 ? 0 : _inputValue.month - 1;

                var valueToCheck = [ _inputValue.year | 0 , _inputValue.month | 0, _inputValue.day | 0 ];

                if ( moment( valueToCheck ).isValid() ) {

                    if ( !isDateDisabled( _inputValue ) ) {
                        DATE_SELECTED = new Date( _inputValue.year, _inputValue.month, _inputValue.day )
                        $scope.renderDays( _inputValue.year, _inputValue.month )
                        $scope.isSubmitDisabled = false;
                        $scope.showSubmitTooltip = false;
                    } else {
                        $scope.isSubmitDisabled = true;
                        $scope.submitTooltip = _inputValue.tooltip;
                    }

                }
            }

            $scope.$on( 'RangesChanged', function () {
                $scope.renderDays( DATE_SELECTED.getFullYear(), DATE_SELECTED.getMonth() )
            } )

            /**
             * Событие при клике на кнопку "ОК"
             * если выбрана не валидная дата ругнется и покажет тултип
             */
            $scope.clickBtn = function () {
                if ( $scope.isSubmitDisabled ) {
                    $scope.showSubmitTooltip = true;
                    setTimeout( function () {
                        $scope.showSubmitTooltip = false;
                        $scope.$apply();
                    }, 1000 );
                } else {
                    $scope.choose()
                }
            };

            // Формирование дат в календаре
            $scope.renderDays = function (year, month) {

                var date = new Date( year, month ),
                    prevMonth = new Date( date.getFullYear(), date.getMonth() - 1 );

                $scope.days = [];
                $scope.title = $scope.month[date.getMonth()] + ', ' + date.getFullYear();

                function addDay (d, m, y) {

                    var day = {
                        day: d,
                        month: m,
                        year: y
                    }

                    day.isCurrent = isCurrent( day );
                    day.isDisabled = isDateDisabled( day );
                    day.isToday = isToday( day )

                    $scope.days.push( day )
                }


                for ( var i = 0; i < getDayOfWeek( date ); i++ ) { // Добавление дат до текушего месяца
                    addDay( daysInMonth( prevMonth ) - (getDayOfWeek( date ) - i - 1), prevMonth.getMonth(), prevMonth.getFullYear() )
                }

                while (date.getMonth() == month) { // Добавляем даты с текущего месяца
                    addDay( date.getDate(), date.getMonth(), date.getFullYear() )
                    date.setDate( date.getDate() + 1 );
                }

                if ( getDayOfWeek( date ) != 0 ) { // Добавляем даты после текущего месяца
                    for ( var i = getDayOfWeek( date ); i < 7; i++ ) {
                        addDay( date.getDate(), date.getMonth(), date.getFullYear() )
                        date.setDate( date.getDate() + 1 );
                    }
                }

                /**
                 * установка даты на первый валидный день
                 */
                var _dateSelected = {
                    day: DATE_SELECTED.getDate(),
                    month: DATE_SELECTED.getMonth(),
                    year: DATE_SELECTED.getFullYear()
                };

                if ( isDateDisabled( _dateSelected ) ) {

                    var activeRange = RangesService.getActiveRangeForDatepicker( $scope.bindedTo ),
                        _d = moment( [_dateSelected.year, _dateSelected.month, _dateSelected.day] ),
                        dStart = activeRange.from.add( 'day', 1 ),
                        dEnd = activeRange.to.subtract( 'day', 1 ), result;

                    if ( dStart.isAfter( dEnd ) ) {
                        //$scope.title = 'Нет доступных дат';
                    }
                    if ( dStart.isSame( dEnd ) ) {
                        result = dStart;
                    } else {

                        if ( _d.diff( dStart ) < 0 ) {

                            if ( _d.diff( dStart ) < _d.diff( dEnd ) ) {
                                result = dEnd;
                            } else {
                                result = dStart;
                            }

                        } else {
                            if ( _d.diff( dStart ) < _d.diff( dEnd ) ) {
                                result = dStart;
                            } else {
                                result = dEnd;
                            }
                        }

                    }

                    DATE_SELECTED = result.toDate();
                    //RENDER_DATE = new Date( DATE_SELECTED.getFullYear(), DATE_SELECTED.getMonth() );
                    $scope.mDate = result.format('DD.MM.YYYY')
                }
            };

            /**
             * на месяц вперёд
             */
            $scope.nextMonth = function () {
                var year = RENDER_DATE.getFullYear(), month = RENDER_DATE.getMonth();

                if (month == 11) {
                    year++;
                    month = 0;
                } else {
                    month++;
                }

                RENDER_DATE = new Date(year, month);
                $scope.renderDays( year, month );

            };

            /**
             * на месяц назад
             */
            $scope.prevMonth = function () {

                var month = RENDER_DATE.getMonth(),
                    year = RENDER_DATE.getFullYear();

                if (month == 0) {
                    year--;
                    month = 11;
                } else {
                    month--;
                }

                RENDER_DATE = new Date(year, month);
                $scope.renderDays(year, month);
            };

            /**
             * Выбор даты
             * @param [item] конкретный день
             */
            $scope.choose = function (item) {

                var item = !!item ?
                    item
                    :
                    {
                        year: DATE_SELECTED.getFullYear(),
                        month: DATE_SELECTED.getMonth(),
                        day: DATE_SELECTED.getDate()
                    };

                if ( !isDateDisabled( item ) ) {
                    var date = new Date( item.year, item.month, item.day );
                    DATE_SELECTED = date;

                    $scope.inputValue.day = item.day;
                    $scope.inputValue.month = item.month + 1;
                    $scope.inputValue.year = item.year;

                    //RENDER_DATE = new Date( item.year, item.month, item.day );
                    $scope.renderDays( item.year, item.month )
                    $scope.mDate = moment( date).format( 'DD.MM.YYYY' )

                } else { // показать подсказку
                    item.isShow = true;
                    setTimeout( function () {
                        item.isShow = false;
                        $scope.$apply();
                    }, 1000 );
                }

            };

            function parseDateString( date ){
                var format = 'D.M.YYYY',
                    result = moment( date, format);

                return result.isValid() ? result.toDate() : date;
            }

            /**
             * проверка из RangesService в разрезе конкретного дэйтпикера
             * @type {function}
             */
            var isDaySelectable = RangesService.isDateSelectable.bind( $scope.bindedTo );

            function isDateDisabled (date) {

                var dateToCheck = new Date(date.year, date.month, date.day),
                    result = isDaySelectable(dateToCheck);

                date.tooltip = result.message

                return !result.selectable;
            }

            function isToday (item) {
                return TODAY.getDate() == item.day && TODAY.getMonth() == item.month && TODAY.getFullYear() == item.year
            }

            function isCurrent (item) {

                var _d = DATE_SELECTED;

                if ( _d.getFullYear() == item.year && _d.getMonth() == item.month && _d.getDate() == item.day ) {
                    return !isDateDisabled( item );
                }

                return false
            };

            $scope.$watch( 'mDate', function (newVal, oldVal, $scope) {

                if ( oldVal !== newVal ) {
                    var date = parseDateString( newVal );

                    DATE_SELECTED = date;
                    RENDER_DATE = new Date( date.getFullYear(), date.getMonth() )

                    $scope.renderDays( date.getFullYear(), date.getMonth() );
                }
            } );

            $scope.$watch( 'inputValue', function (newVal, oldVal, $scope) {
                if ( oldVal !== newVal ) {
                    checkInputsValue( $scope, newVal );
                }
            }, true );



            // если выбранный изначально день заблокирован, нужно выбрать ближайший валидный
            if ( isDateDisabled( {year: DATE_SELECTED.getFullYear(), month: DATE_SELECTED.getMonth(), day: DATE_SELECTED.getDate()} )){
                //$scope.renderDays( DATE_SELECTED.getFullYear(), DATE_SELECTED.getMonth())
            } else {
                $scope.choose()
            }

        }
    };
}] );
