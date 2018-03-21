(function ($) {
    var defaultSettings = {
        'fields': [
            {
                'id': '',
                'valids': [
                    {
                        'trigger': null,
                        'func': function ($dom) {
                        },
                        'msg': 'error valid'
                    }
                ]
            }
        ]
    };
    var errorMsg = '<span class="help-block error-msg hide #class#">#msg#</span>';
    /**
     * 方法列表
     * @type {{init: init}}
     */
    var methods = {
        init: function (options) {
            var $this = $(this),
                opt = $.extend({}, defaultSettings, options);
            //初始化插件实例
            var myPlugin = new MyPlugin();
            myPlugin.$this = $this;
            myPlugin.opt = opt;
            //存储实例对象
            $this.data('form_Check', myPlugin);
            //添加事件监听
            if (opt.fields.length > 0) {
                for (var i = 0; i < opt.fields.length; i++) {
                    var _item = opt.fields[i],
                        $dom = $this.find('#' + _item.id);
                    if ($dom[0]) {
                        for (var j = 0; j < _item.valids.length; j++) {
                            eventBind(_item.valids[j], $dom);
                        }
                    } else {
                        $.error('id ' + _item.id + ' not found');
                    }
                }
            }
        },
        /**
         * 方法:检查
         * @param _success  成功验证后的回调
         * @param _fail     验证失败后的回调
         * @returns {boolean}
         */
        check: function (_success,_fail) {
            var $this = $(this),
                myPlugin = $this.data('form_Check');
            if (myPlugin == null) {
                $.error('plugin has not inited');
                return false;
            }
            var opt = myPlugin.opt;

            //全局结果
            var globalResult = false;
            //事件集合
            var eventArray = [];
            if (opt.fields.length > 0) {
                for (var i = 0; i < opt.fields.length; i++) {
                    var _item = opt.fields[i],
                        $dom = $this.find('#' + _item.id);
                    if ($dom[0]) {
                        for (var j = 0; j < _item.valids.length; j++) {
                            eventArray.push(function () {
                                var dtd = $.Deferred();
                                syncTrigger(_item, $dom, globalResult)
                                return dtd;
                            });
                        }
                    } else {
                        $.error('id ' + _item.id + ' not found');
                    }
                }
            }
            //执行所有事件
            if (eventArray.length > 0){
                $.when.apply($, eventArray).then(function () {
                    console.log(globalResult)
                    if (globalResult){
                        if (typeof _success !== 'undefined') {
                            _success();
                        }
                    }else {
                        if (typeof _fail !== 'undefined') {
                            _fail();
                        }
                    }
                })
            }
            return $this;
        }
    }
    //事件绑定
    var eventBind = function (_item, $dom) {
        var trigger = _item.trigger || 'form_check_trigger';
        $dom.on(trigger, function () {
            if (typeof _item.func !== 'undefined') {
                var flag = _item.func($dom);
                if (!flag) {
                    setMessage(_item, $dom);
                }
            }
        });
        $dom.on('focus', function () {
            $dom.parent().find('.trigger_' + trigger).addClass('hide');
            $dom.parent().removeClass('has-error');
        });
        $dom.children().on('click', function () {
            $dom.parent().find('.trigger_' + trigger).addClass('hide');
            $dom.parent().removeClass('has-error');
        });
        //设置错误消息
        var msg = errorMsg.replace(/#msg#/, _item.msg);
        msg = msg.replace(/#class#/, 'trigger_' + trigger);
        $dom.parent().append(msg);
    }

    //同步触发器
    var syncTrigger = function (_item, $dom, globalResult) {
        var trigger = _item.trigger || 'form_check_trigger';
        $dom.trigger(trigger, function (flag) {
            if (globalResult) {
                globalResult = flag
            }
        });
    }

    //设置消息
    var setMessage = function (_item, $dom) {
        var trigger = _item.trigger || 'form_check_trigger';
        $dom.parent().find('.trigger_' + trigger).removeClass('hide');
        $dom.parent().addClass('has-error');
    }

    //插件实例
    MyPlugin.prototype = {
        $this: null,
        opt: null
    }

    function MyPlugin() {
    }

    //简易表单验证
    $.fn.formCheck = function (method) {
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