(function ($) {
    //中文
    var zh = {
        title: {
            week: '星期',
            time: '小时'
        },
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    };
    //英文
    var en = {
        title: {
            week: 'week',
            time: 'hour'
        },
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    };
    //默认设置
    var defaultSettings = {
        language: 'zh',
        defaultData: {
            key: -1,
            value: "<i class=\"fa fa-ban text-danger\"> </i>"
        },
        datas: [],
        times: 24,
        beforeSelect: function (myPlugin) {
        },
        onSelected: function (myPlugin) {
        }
    };
    //颜色地图
    var colorMap = {};
    var getRandomColor = function (num) {
        var result = colorMap[num];
        if (!result){
            result = 'hsla('+ Math.floor(Math.random()*360) +',70%,90%,1)';
            colorMap[num] = result;
        }
        return result;
    }

    var language = zh;

    /**
     * 方法列表
     * @type {{init: init}}
     */
    var methods = {
        init: function (options) {
            initMethod($(this), options);
        },
        reload: function (datas) {
            var $this = $(this),
                myPlugin = $this.data('rate_standrad_table');
            //清空
            $this.find('.rate-table-row').empty();
            //重新构建
            myPlugin.opt.datas = datas;
            buildTableContent(myPlugin);
            //重新绑定事件
            bindEvent(myPlugin);
        },
        getSelected: function () {
            return $(this).find('.active');
        },
        clearSelected: function () {
            var myPlugin = $(this).data('rate_standrad_table');
            clearSelected(myPlugin);
        }
    }
    /**
     * 初始化方法
     * @param $this
     * @param options
     * @returns {*}
     */
    var initMethod = function ($this, options) {
        var opt = $.extend(defaultSettings, options);

        //初始化插件实例
        var myPlugin = new MyPlugin();
        myPlugin.$this = $this;
        myPlugin.opt = opt;
        //存储实例对象
        $this.data('rate_standrad_table', myPlugin);

        //语言切换
        if (opt.language != 'zh') {
            language = en;
        }
        //创建头
        buildTableHead(myPlugin);
        //创建内容
        buildTableContent(myPlugin);
        //事件绑定
        bindEvent(myPlugin);

        return $this;
    }
    //创建头
    var buildTableHead = function (myPlugin) {
        var thead = '<thead><tr class="rate-table-head-row">',
            title = '<th class="rate-table-head-th">' + language.title.week + '/' + language.title.time + '</th>';
        thead += title;
        for (var time = 0; time < myPlugin.opt.times; time++) {
            thead += '<th class="rate-table-head"> ' + time + '</th>';
        }
        thead += '</tr></thead>';
        myPlugin.$this.append(thead);
    }
    //创建内容
    var buildTableContent = function (myPlugin) {
        var opt = myPlugin.opt,
            content = '',
            counter = 0;
        for (var day = 0; day < language.days.length; day++) {
            var tr = '<tr class="rate-table-row">',
                tDay = '<td class="rate-table-day">' + language.days[day] + '</td>';

            tr += tDay;

            for (var time = 0; time < opt.times; time++) {
                var key = opt.datas && opt.datas[counter] ? opt.datas[counter].key : opt.defaultData.key,
                    value = opt.datas && opt.datas[counter] ? opt.datas[counter].value : opt.defaultData.value;
                var td = '<td class="rate-table-td" data-row = "' + day
                    + '" data-col = "' + time
                    + '" data-value = "' + key + '" style="background-color: ' + getRandomColor(key) +'">' + value + '</td>';

                tr += td;
                //计数器自增长
                counter++;
            }

            content = content + tr + '</tr>';
        }
        myPlugin.$this.append(content);
    }

    /**
     * 坐标对象
     * @param dom
     */
    var location = function (dom) {
        this.x = parseInt($(dom).attr('data-col'));
        this.y = parseInt($(dom).attr('data-row'));
    }
    /**
     * 事件绑定
     */
    var bindEvent = function (myPlugin) {
        var $this = myPlugin.$this, opt = myPlugin.opt;

        //清空事件,再绑定
        $this.off('mouseup', '.rate-table-td');
        $this.off('mousedown', '.rate-table-td');
        $this.off('mouseover', '.rate-table-td');

        $this.on('mouseup', '.rate-table-td', function () {
            var end = new location(this);
            myPlugin.end = end;

            $(this).addClass('active');
            //触发结束事件
            if (typeof opt.onSelected !== 'undefined') {
                opt.onSelected(myPlugin);
            }
        });
        $this.on('mousedown', '.rate-table-td', function () {
            clearSelected(myPlugin);

            var start = new location(this);
            myPlugin.start = start;

            $(this).addClass('active');
            //触发开始事件
            if (typeof opt.beforeSelect !== 'undefined') {
                opt.beforeSelect(myPlugin);
            }
        });
        $this.on('mouseover', '.rate-table-td', function () {
            var start = myPlugin.start, end = myPlugin.end;
            if (start == null || end != null) {
                return;
            }
            var nowLocation = new location(this),
                startTemp = start,
                endTemp = nowLocation;
            //异步加载,提升效率
            setTimeout(function () {
                //清空已选中对象
                $this.find('.rate-table-td').removeClass('active');

                var xMin = startTemp.x, xMax = endTemp.x;
                if (xMin > xMax) {
                    xMin = endTemp.x;
                    xMax = startTemp.x;
                }
                for (var i = xMin; i <= xMax; i++) {
                    var yMin = startTemp.y, yMax = endTemp.y;
                    if (yMin > yMax) {
                        yMin = endTemp.y;
                        yMax = startTemp.y;
                    }
                    for (var j = yMin; j <= yMax; j++) {
                        $this.find('.rate-table-td[data-row="' + j + '"][data-col="' + i + '"]').addClass('active');
                    }
                }
            })
        })
        $this.on('selectstart', '.rate-table-td', function () {
            return false;
        })
    }
    /**
     * 清除选中
     */
    var clearSelected = function (myPlugin) {
        //清空开始和结束对象
        myPlugin.start = null;
        myPlugin.end = null;
        //清除选中前,改变背景色

        //清空已选中对象
        myPlugin.$this.find('.active').each(function () {
            $(this).css('background-color',getRandomColor($(this).attr('data-value')));
            $(this).removeClass('active');
        });
    }

    //插件实例
    MyPlugin.prototype = {
        $this: null,
        opt: null,
        start: null,
        end: null
    }
    function MyPlugin() {}
    /**
     * 日期框选插件
     * @param options
     * @returns {*}
     */
    $.fn.rateStandradTable = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.rateStandradTable');
        }
    }
})(jQuery);