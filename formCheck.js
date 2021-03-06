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
    //默认验证规则
    var defaultRules = {
        'required' : function ($dom) {
            if ($dom.val() == '') {
                return false;
            }
            return true;
        }
    }
    
    var errorMsg = '<span class="help-block error-msg hide">#msg#</span>';
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
                            eventBind(_item.valids[j],$dom);
                        }
                    } else {
                        $.error('id ' + _item.id + ' not found');
                    }
                }
            }
        },
        check: function () {
            var $this = $(this),
                myPlugin = $this.data('form_Check');
            if (myPlugin == null){
                $.error('plugin has not inited');
                return false;
            }
            var opt = myPlugin.opt,
                result = true;

            //执行所有事件
            if (opt.fields.length > 0) {
                for (var i = 0; i < opt.fields.length; i++) {
                    var _item = opt.fields[i],
                        $dom = $this.find('#' + _item.id);
                    if ($dom[0]) {
                        for (var j = 0; j < _item.valids.length; j++) {
                            var trigger = _item.trigger || 'form_check_trigger';
                            $dom.trigger(trigger,function (flag) {
                                if (!flag){
                                    result = flag;
                                }
                            });
                        }
                    } else {
                        $.error('id ' + _item.id + ' not found');
                    }
                }
            }
            return result
        }
    }
    //事件绑定
    var eventBind = function (_item, $dom) {
        var trigger = _item.trigger || 'form_check_trigger';
        $dom.on(trigger, function (event,_callback) {
            var flag;
            if (typeof _item.func == 'string'){
                flag = defaultRules[_item.func].call(this,$dom);
            }else if (typeof _item.func !== 'undefined') {
                flag = _item.func($dom);
            }
            if (!flag) {
                setMessage($dom);
            }
            if (typeof _callback !== 'undefined'){
                _callback(flag);
            }
        });
        $dom.on('focus', function () {
            hideMessage($dom);
        });
        $dom.children().on('click', function () {
            hideMessage($dom);
        });
        //设置错误消息
        var msg = errorMsg.replace(/#msg#/,_item.msg);
        findParent($dom).append(msg);
    }
    //寻找父节点
    var findParent = function ($dom) {
        var $parent = $dom.parent();
        if (!$parent.hasClass('form-group')){
            $parent = $parent.parent();
        }
        return $parent;
    }
    //设置消息
    var setMessage = function ($dom) {
        findParent($dom).find('.error-msg').removeClass('hide');
        findParent($dom).addClass('has-error');
    }
    //隐藏消息
    var hideMessage = function ($dom) {
        findParent($dom).find('.error-msg').addClass('hide');
        findParent($dom).removeClass('has-error');
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