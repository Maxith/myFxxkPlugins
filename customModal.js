(function ($) {
    var defaultOptions = {
        'id': 'myCustomModal',
        'title': 'title',
        'url': null,    //优先使用url加载内容
        'data' : null,  //附加参数
        'content': '',
        'buttons': [
            {
                'id' : 'saveBtn',
                'title': 'save',
                'class': 'btn btn-primary',
                'dismiss': false,
                'onclick': function () {
                }
            },
            {
                'id' : 'closeBtn',
                'title': 'Close',
                'class': 'btn btn-default',
                'dismiss': true,
                'onclick': function () {
                }
            }
        ],
        'size': 'modal-md',  //模态框大小class 默认两种:,modal-sm ,modal-lg
        'isStatic': true,     //是否静态,当不为静态时点击其他地方自动关闭模态框
        'onLoadComplete' : function () { //加载完成事件

        } ,
        'onClose': function () {
        }
    };
    /**
     * 创建modal字符串
     * @param opt
     * @returns {string}
     */
    var buildModal = function (options) {
        var custom = '<div class="modal fade myCustomModal" tabindex="-1" role="dialog" aria-labelledby="customModalLabel" id="#id#">' +
            '        <div class="modal-dialog #size#" role="document">' +
            '            <div class="modal-content">' +
            '                <div class="modal-header">' +
            '                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '                    <h4 class="modal-title" id="customModalLabel">#title#</h4>' +
            '                </div>' +
            '                <div class="modal-body"></div>' +
            '                <div class="modal-footer">#buttons#</div>' +
            '            </div>' +
            '        </div>' +
            '    </div>'

        custom = custom.replace(/#id#/g, options.id);    //id
        custom = custom.replace(/#size#/g, options.size);    //尺寸
        custom = custom.replace(/#title#/g, options.title);   //标题

        //按钮
        var btn = '', btnTemplate = '<button type="button" id="#btnId#" class="btn #class#" #dismiss#>#title#</button>';
        for (var i = 0; i < options.buttons.length; i++) {
            var temp = btnTemplate,
                dismiss = '',
                btnId = options.buttons[i].id;

            if (btnId != undefined && btnId != null){
                temp = temp.replace(/#btnId#/g, options.buttons[i].id);
            }
            temp = temp.replace(/#class#/g, options.buttons[i].class);
            temp = temp.replace(/#title#/g, options.buttons[i].title);

            if (options.buttons[i].dismiss) {
                dismiss = 'data-dismiss="modal"';
            }
            temp = temp.replace(/#dismiss#/g, dismiss);

            btn += temp;
        }
        custom = custom.replace(/#buttons#/g, btn);

        return custom;
    }
    /**
     * 自定义模态框
     * 基于bootstrap的modal组件
     * @param options
     */
    $.fn.myCustomModal = function (settings) {
        var options = $.extend({},defaultOptions, settings);

        var modalContent = window.top.document.getElementById('modalContent');
        if (modalContent.length < 1) {
            return;
        }
        //清空弹出层
        closeAndClear(modalContent);

        //创建modal
        $(modalContent).append(buildModal(options));

        //设置内容
        var model = $(modalContent).find('#' + options.id);

        if (options.url != null && options.url != ''){
            model.find('.modal-body').load(options.url,options.data);
        }else {
            model.find('.modal-body').append(options.content);
        }

        //绑定按钮事件
        model.find('.modal-footer').find('button').each(function (index) {
            $(this).unbind('click');
            $(this).click(function () {
                if (typeof options.buttons[index].onclick !== 'undefined') {
                    options.buttons[index].onclick();
                }
            });
        });

        //窗口加载完成事件绑定
        model.on('show.bs.modal',function () {
            if (typeof options.onLoadComplete() !== 'undefined') {
                options.onLoadComplete();
            }
        })
        //窗口关闭事件绑定
        model.on('hide.bs.modal', function () {
            if (typeof options.onClose !== 'undefined') {
                setTimeout(options.onClose)
            }
        })

        //激活modal
        model.modal({
            'keyboard': false,
            'show': true,
            'backdrop': !options.isStatic
        });
    }
    /**
     * ============================ 下述自定义确认模态框 =============================================
     */
    /**
     * 自定义确认模态框
     * @param options
     */
    $.fn.myConfirmModal = function (settings) {
        var options = {
            'id' : 'myConfirmModal',
            'title' : 'title',
            'content' : 'content',
            'icon' : 'fa-question-circle',
            'onConfirm' : function () {},
            'onClose' : function () {}
        };
        $.extend(options, settings);
        var modalContent = window.top.document.getElementById('modalContent');
        if (modalContent.length < 1) {
            return;
        }
        //清空弹出层
        closeAndClear(modalContent);

        //创建modal
        var custom = '<div class="modal fade myConfirmModal" id="#id#" tabindex="-1" role="dialog" aria-labelledby="myConfirmModalLabel">' +
            '        <div class="modal-dialog" role="document">' +
            '            <div class="modal-content">' +
            '                <div class="modal-header">' +
            '                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '                    <h4 class="modal-title" id="myConfirmModalLabel">' +
            '                        <i class="fa #icon#"></i>' +
            '                        <span>#title#</span>' +
            '                    </h4>' +
            '                </div>' +
            '                <div class="modal-body text-danger text-center">' +
            '                    <h3 style="line-height: 35px">#content#</h3>' +
            '                </div>' +
            '                <div class="modal-footer">' +
            '                    <button type="button" class="btn btn-danger">确认</button>' +
            '                    <button type="button" class="btn btn-primary" data-dismiss="modal">取消</button>' +
            '                </div>' +
            '            </div>' +
            '        </div>' +
            '    </div>';

        custom = custom.replace(/#id#/g, options.id);    //id
        custom = custom.replace(/#title#/g, options.title);   //标题
        custom = custom.replace(/#icon#/g, options.icon);   //符号
        custom = custom.replace(/#content#/g, options.content);    //内容
        $(modalContent).append(custom);

        //绑定按钮事件
        var model = $(modalContent).find('#' + options.id);
        model.find('.modal-footer').find('button:first').unbind('click');
        model.find('.modal-footer').find('button:first').click(function () {
            setTimeout(function () {
                options.onConfirm();
                model.modal('hide');
            },100)
        });
        //窗口关闭事件绑定
        model.on('hidden.bs.modal', function () {
            if (typeof options.onClose !== 'undefined') {
                options.onClose();
            }
        })
        //激活modal
        model.modal({
            'keyboard': false,
            'show': true,
            'backdrop': false
        });
    }

    /**
     * ============================ 下述自定义提示模态框 =============================================
     */
    /**
     * 自定义提示模态框
     * @param options
     */
    $.fn.myAlertModal = function (content,time,backdrop) {
        var modalContent = window.top.document.getElementById('modalContent');
        if (modalContent.length < 1) {
            return;
        }
        //关闭并清理弹出层
        closeAndClear(modalContent);
        //创建modal
        var custom = '<div class="modal fade myAlertModal" id="myAlertModal" tabindex="-1" role="dialog" aria-labelledby="myAlertModalLabel">' +
            '        <div class="modal-dialog" role="document">' +
            '            <div class="modal-content">' +
            '                <div class="modal-body text-warning">' +
            '                    <h3><i class="fa fa-info-circle"></i>&nbsp;&nbsp; #content#</h3>' +
            '                </div>' +
            '            </div>' +
            '        </div>' +
            '    </div>';
        custom = custom.replace(/#content#/g, content);    //内容
        $(modalContent).append(custom);

        //激活modal
        var model = $(modalContent).find('#myAlertModal').modal({
            'keyboard': false,
            'show': true,
            'backdrop': backdrop
        });
        //定时关闭
        if (!time){
            time = 1500;
        }
        setTimeout(function () {
            model.modal('hide');
        },time)
    }
    /**
     * 关闭并清理弹出层
     */
    var closeAndClear = function (modalContent) {
        try {
            //清理弹出层
            $(modalContent).empty();
            //清除遮罩层
            $('.modal-backdrop').remove();
        }catch (e){}
    }
})(jQuery);