(function ($) {
    /**
     * 简易table插件，基于dataTables的默认实现，用于设置全局默认参数
     * @param options   基础设置
     * @param dataTableConfig   dataTable的设置
     * @returns 返回dataTable对象
     * @author zhouyou
     * @date 2018/1/4 15:32
     */
    $.fn.customSimpleTable = function (options) {
        var def = $.extend({}, {
            'hidePager' : false,
            'pageLength': 15,
            'url': null,   //表单内容链接地址
            'columns': null,    //表格定义
            'language': document.getElementsByTagName('html')[0].lang,   //默认中文
            'onLoaded': null,  //加载完成事件
            'data': function () {},
            'autoWidth': false,  //自动宽度
            'scrollX': false,
            'scrollY': false,
            'scrollCollapse': true,
            'columnDefs': []
        }, options);

        var url = 'bower_components/datatables/i18n/' + def.language + '.json';

        var opt = $.extend({}, {
            'info' : !def.hidePager,
            'pageLength': def.pageLength,  //默认数据长度
            'paging': !def.hidePager,   //分页
            'searching': false,   //查询,
            'ordering': false,    //排序
            'processing': true,    //进度条
            'autoWidth': def.autoWidth,  //自动宽度
            'scrollX' : def.scrollX,   //水平滚动
            'scrollXInner' : '100%',
            'scrollY': def.scrollY,
            'scrollCollapse': def.scrollCollapse,
            'serverSide': true,   //服务器模式
            'lengthChange': false,  //关闭行数选择
            'language': {           //国际化
                'url': url
            },
            'ajax': {              //异步加载
                'url': def.url,
                'type': 'post',
                'data': function (d) {
                    if (typeof def.data !== 'undefined'){
                        d = $.extend({},d,def.data());
                    }
                    return d;
                }
            },
            'columns': def.columns,
            'columnDefs': def.columnDefs
        });

        var obj = $(this).DataTable(opt);

        //设置事件监听
        if (def.onLoaded != null && typeof def.onLoaded !== 'undefined') {
            obj.on('draw', function (e, setting, json) {
                def.onLoaded(e, setting, json);
            });
        }
        //设置表头动态宽度
        try {
            if (contentResizeEvent !== 'undefined'){
                contentResizeEvent = function () {
                    $('.dataTables_scrollHeadInner').css({'width':'100%'});
                    $('.dataTables_scrollHeadInner').find('table').css({'width':'100%'});
                }
            }
        }catch (ex){}

        return obj;
    }
})(jQuery);