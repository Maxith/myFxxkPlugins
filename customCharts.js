(function ($) {
    /**
     * 依赖插件检查
     * @returns {boolean}
     */
    var checkPlugins = function () {
        if (typeof jQuery == 'undefined') {
            console.error('jQuery not found')
            return false;
        }
        return true;
    }
    /**
     * 默认数据格式化
     * @param datas
     * @returns {any[]}
     */
    var defaultFormatter = function (datas) {
        var result = new Array(datas.length);
        for (var i = 0; i < datas.length; i++) {
            result[i] = new Array(datas[i].length);
            for (var j = 0; j < datas[i].length; j++) {
                if (datas[i][j] != null) {
                    result[i][j] = datas[i][j].data;
                } else {
                    result[i][j] = 0;
                }
            }
        }
        return result;
    }
    /**
     * 默认设置
     * @type {{url: null, postData: {}, labels: null, showLegend: boolean, datasets: *[], dataFormatter: defaultFormatter, scales: {x: {display: boolean, labelString: string}, y: {display: boolean, labelString: string}}, showDataLabel: boolean, dataLabelFormatter: null}}
     */
    var defaultSettings = {
        type : 'line',
        url: null,
        postData: {},
        labels: null,
        showLegend: true,//是否展示标题
        datasets: [{
            'label': 'label',
            'fill': false
        }],
        dataFormatter: defaultFormatter,
        scales: {
            'x': {
                'display': true,
                'labelString': 'x'
            },
            'y': {
                'display': true,
                'labelString': 'y'
            }
        },
        showDataLabel: false,
        dataLabelFormatter: null
    }
    /**
     * 方法
     * @type {{init: init, update: update}}
     */
    var methods = {
        init : function (options) {
            var $this = $(this),
                opt = $.extend({}, defaultSettings, options);
            //初始化插件实例
            var myCustomCharts = new MyCustomCharts();
            myCustomCharts.$this = $this;
            myCustomCharts.opt = opt;
            //存储实例对象
            setMyPlugin($this,myCustomCharts);

            //不同类型初始化
            if (typesInit[opt.type]) {
                return typesInit[opt.type].call(this, opt);
            }
            $.error('chart type ' + opt.type + ' does not support on jQuery.customCharts');
            return null;
        },
        update : function (postData) {
            var $this = $(this),
                myCustomCharts = getMyPlugin($this),
                chart = myCustomCharts.chart;

            myCustomCharts.opt.postData = postData;
            //更新数据
            loadDatas(chart,myCustomCharts.opt);
        }
    }
    /**
     * 支持类型初始化
     * @type {{line: line}}
     */
    var typesInit = {
        line : function (opt) {
            var $this = $(this),
                myCustomCharts = getMyPlugin($this);

            var chart;
            var chartConfig = {
                type: 'line',
                data: {
                    labels: opt.labels,
                    datasets: opt.datasets
                },
                options: {
                    responsive: true,
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: false
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: opt.scales.x
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: opt.scales.y
                        }]
                    },
                    legend: {
                        display: opt.showLegend
                    }
                }
            };

            //注册chartjs插件
            if (opt.showDataLabel) {
                registPlugin(opt.dataLabelFormatter);
            }

            //初始化控件
            var canvas = $(this)[0].getContext('2d');
            chart = new Chart(canvas, chartConfig);

            //初始化数据
            loadDatas(chart,opt);

            //设置chart
            myCustomCharts.chart = chart;
            //更新插件
            setMyPlugin($this,myCustomCharts);

            return $this;
        }
    }

    /**
     * 加载数据
     * @param chart
     * @param opt
     */
    var loadDatas = function (chart,opt) {
        //加载数据
        $.post(opt.url, opt.postData, function (req) {
            var datas = req.datas;
            if (typeof opt.dataFormatter !== 'undefined') {
                datas = opt.dataFormatter(datas);
            }
            for (var i = 0; i < datas.length; i++) {
                chart.data.datasets[i].data = datas[i];
                chart.data.datasets[i].baseData = req.datas[i];
            }

            //更新数据
            chart.update();
        });
    }

    /**
     * 注册chartjs插件
     */
    var registPlugin = function (formatter) {
        Chart.plugins.register({
            afterDatasetsDraw: function (chart) {
                var ctx = chart.ctx;

                chart.data.datasets.forEach(function (dataset, i) {
                    var meta = chart.getDatasetMeta(i);
                    if (!meta.hidden) {
                        meta.data.forEach(function (element, index) {
                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgb(0, 0, 0)';

                            var fontSize = 16;
                            var fontStyle = 'normal';
                            var fontFamily = 'Helvetica Neue';
                            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                            // Just naively convert to string for now
                            //展示数据
                            var dataString = dataset.data[index].toString();
                            if (formatter != null) {
                                dataString = formatter(dataset.baseData[index]);
                            }

                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';

                            var padding = 5;
                            var position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                        });
                    }
                });
            }
        });
    }

    /**
     * 获取插件
     * @param $this
     * @returns {boolean}
     */
    var getMyPlugin = function ($this) {
        var myPlugin = $this.data('custom_charts');
        if (myPlugin == null){
            $.error('plugin has not inited');
            return false;
        }
        return myPlugin;
    }
    /**
     * 设置插件
     * @param $this
     * @param plugin
     */
    var setMyPlugin = function ($this,plugin) {
        $this.data('custom_charts',plugin);
    }

    //插件实例
    MyCustomCharts.prototype = {
        $this: null,
        opt: null,
        chart : null
    }

    function MyCustomCharts() { }

    //简易表单验证
    $.fn.customCharts = function (method) {
        if (!checkPlugins()){
            return false;
        }
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.formCheck');
        }
    }
})(jQuery);