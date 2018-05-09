(function () {
    /**
     * 插件检查
     * @returns {boolean}
     */
    var checkPlugins = function () {
        if (typeof jQuery == 'undefined') {
            console.error('jQuery not found')
            return false;
        }
        if (typeof moment == 'undefined') {
            console.error('moment not found')
            return false;
        }
        return true;
    }

    /**
     * 简易时间范围选择器
     * @param pickerStart
     * @param pickerEnd
     * @param language
     * @returns {boolean}
     */
    this.datepickerPlus = function (pickerStart, pickerEnd, language) {
        if (!checkPlugins()) {
            return false;
        }
        try {
            $.fn.datepicker == undefined;
        } catch (ex) {
            console.error('datepicker not found')
            return false;
        }

        var $pickerStart = $('#' + pickerStart),
            $pickerEnd = $('#' + pickerEnd);

        $pickerStart.datepicker({
            language: language,
            format: 'yyyy-mm-dd',
            autoclose: true
        }).on('changeDate', function (e) {
            var start = moment(e.date).add(1, 'd')._d, end = moment(e.date).add(6, 'M')._d;

            pickerSetup($pickerEnd, start, end);
        }).on('clearDate', function () {
            clearLimit(pickerStart, pickerEnd);
        });

        $pickerEnd.datepicker({
            language: language,
            format: 'yyyy-mm-dd',
            autoclose: true
        }).on('changeDate', function (e) {
            var start = moment(e.date).subtract(6, 'M')._d, end = moment(e.date).subtract(1, 'd')._d;

            pickerSetup($pickerStart, start, end);
        }).on('clearDate', function () {
            clearLimit(pickerStart, pickerEnd);
        });

        initDate($pickerStart, $pickerEnd);
    }

    /**
     * 自然周选择器
     * @param picker
     * @param startDate
     * @param weekLength
     * @returns {boolean}
     */
    this.weekDateRangePicker = function (picker, startDate, weekLength, callback) {
        if (!checkPlugins()) {
            return false;
        }
        try {
            $.fn.daterangepicker == undefined;
        } catch (ex) {
            console.error('dateRangePicker not found')
            return false;
        }

        $(picker).append('<i class="fa fa-calendar"></i>&nbsp;<span></span>&nbsp;<i class="fa fa-caret-down"></i>');
        $(picker).css('line-hight','30px');
        $(picker).css('width','205px');

        //选择范围
        var ranges = {}, defualtWeek = [moment(startDate).day(1), moment(startDate).day(7)],
            defualtWeekStr = weekFormatter(defualtWeek[0], defualtWeek[1]);
        //默认周
        ranges[defualtWeekStr] = defualtWeek;
        //循环生成多个自然周
        for (var i = 1; i <= weekLength; i++) {
            var start = moment(startDate).day(-7 * i),
                end = moment(startDate).day(-1 * i);
            ranges[weekFormatter(start, end)] = [start, end];
        }

        //初始化时间范围选择器
        $(picker).daterangepicker(
            {
                startDate: defualtWeek[0]._d,
                endDate: defualtWeek[1]._d,
                ranges: ranges,
                showCustomRangeLabel: false,
                opens: "center"
            },
            function (start, end, label) {
                $(picker).find('span').html(label);
                if (typeof callback !== 'undefined') {
                    callback(start, end);
                }
            }
        );

        $(picker).find('span').html(defualtWeekStr);
    }
    /**
     * 月份选择器
     * @param picker
     * @param startDate
     * @param monthLength
     * @param callback
     * @returns {boolean}
     */
    this.monthDateRangePicker = function (picker, startDate, monthLength, callback) {
        if (!checkPlugins()) {
            return false;
        }
        try {
            $.fn.daterangepicker == undefined;
        } catch (ex) {
            console.error('dateRangePicker not found')
            return false;
        }

        $(picker).append('<i class="fa fa-calendar"></i>&nbsp;<span></span>&nbsp;<i class="fa fa-caret-down"></i>');
        $(picker).css('line-hight','30px');
        $(picker).css('width','115px');

        //选择范围
        var ranges = {},
            defualtMonth = [
                moment(startDate).set('date',1),
                moment(startDate).set('date',1).add(1,'M')
            ],
            defualtMonthStr = monthFormatter(defualtMonth[0]);
        //默认周
        ranges[defualtMonthStr] = defualtMonth;
        //循环生成多个月份
        for (var i = 1; i <= monthLength; i++) {
            var start = moment(startDate).set('date',1).subtract(1*i,'M'),
                end = moment(startDate).set('date',1).subtract(1*(i-1),'M');
            ranges[monthFormatter(start)] = [start, end];
        }

        //初始化时间范围选择器
        $(picker).daterangepicker(
            {
                startDate: defualtMonth[0]._d,
                endDate: defualtMonth[1]._d,
                ranges: ranges,
                showCustomRangeLabel: false,
                opens: "center"
            },
            function (start, end, label) {
                $(picker).find('span').html(label);
                if (typeof callback !== 'undefined') {
                    callback(start, end);
                }
            }
        );

        $(picker).find('span').html(defualtMonthStr);
    }

    function weekFormatter(start, end) {
        return start.format('MMMM Do') + ' - ' + end.format('MMMM Do')
    }

    function monthFormatter(start) {
        return start.format('YYYY MMMM')
    }

    /**
     * 初始化时间
     * @param $pickerStart
     * @param $pickerEnd
     */
    function initDate($pickerStart, $pickerEnd) {
        var start = moment().subtract(6, 'M'),
            end = moment().add(1, 'd');

        //初始化时间
        $pickerStart.val(start.format('YYYY-MM-DD'));
        $pickerEnd.val(end.format('YYYY-MM-DD'));

        //设置选择范围
        pickerSetup($pickerStart, start._d, end.subtract(1, 'd')._d);
        pickerSetup($pickerEnd, start.add(1, 'd')._d, end._d);
    }

    /**
     * 时间选择器设置
     * @param $picker
     * @param start
     * @param end
     */
    function pickerSetup($picker, start, end) {
        var date = $picker.datepicker('getDate');
        //判断时间是否在时间段内,不在即清空
        if (date) {
            if (date < start || date > end) {
                $picker.datepicker('clearDates');
            }
        }
        //设置最大时间和最小时间
        $picker.datepicker('setStartDate', start);
        $picker.datepicker('setEndDate', end);
    }

    /**
     * 清除限制
     * @param start
     * @param end
     */
    function clearLimit(start, end) {
        var $start = $('#' + start),
            $end = $('#' + end);
        if ($start.val() == '' && $end.val() == '') {
            $start.datepicker('setStartDate', '');
            $start.datepicker('setEndDate', '');
            $end.datepicker('setStartDate', '');
            $end.datepicker('setEndDate', '');
        }
    }
})();