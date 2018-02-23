/**
 *  高精度浮点计算插件( 抄袭版 )
 *  来源地址 : https://my.oschina.net/cjlice/blog/1616682
 *  原作者 : BarZu
 *
 *  @author zhouyou
 *  @date 2018/2/13 15:35
 **/
(function(){
    //定义一些api
    var _plugin_api = {
        /**
         * 浮点加法
         * @param a
         * @param b
         * @returns {*}
         */
        plus : function (a, b) {
            return fixedFloat(a, b, '+');
        },
        /**
         * 浮点减法
         * @param a
         * @param b
         * @returns {*}
         */
        minus : function (a, b) {
            return fixedFloat(a, b, '-');
        },
        /**
         * 浮点乘法
         * @param a
         * @param b
         * @returns {*}
         */
        multiply : function (a, b) {
            return fixedFloat(a, b, '*');
        },
        /**
         * 浮点除法
         * @param a
         * @param b
         * @returns {*}
         */
        division : function (a, b) {
            if (a == 0){
                return 0;
            }
            return fixedFloat(a, b, '/');
        }
    }
    /**
     * 高精度浮点计算插件
     * @type {{plus: plus, minus: minus, multiply: multiply, division: division}}
     */
    this.FloatArithmetic =  _plugin_api;

    // 补0
    function padding0(p) {
        var z = ''
        while (p--) {
            z += '0'
        }
        return z
    }

    /**
     * 解决小数精度问题
     * @param {*数字} a
     * @param {*数字} b
     * @param {*符号} sign
     * fixedFloat(0.3, 0.2, '-')
     */
    function fixedFloat(a, b, sign) {
        function handle(x) {
            var y = String(x)
            var p = y.lastIndexOf('.')
            if (p === -1) {
                return [y, 0]
            } else {
                return [y.replace('.', ''), y.length - p - 1]
            }
        }

        // v 操作数1, w 操作数2, s 操作符, t 精度
        function operate(v, w, s, t) {
            switch (s) {
                case '+':
                    return (v + w) / t
                case '-':
                    return (v - w) / t
                case '*':
                    return (v * w) / (t * t)
                case '/':
                    return (v / w)
            }
        }

        var c = handle(a)
        var d = handle(b)
        var k = 0

        if (c[1] === 0 && d[1] === 0) {
            return operate(+c[0], +d[0], sign, 1)
        } else {
            k = Math.pow(10, Math.max(c[1], d[1]))
            if (c[1] !== d[1]) {
                if (c[1] > d[1]) {
                    d[0] += padding0(c[1] - d[1])
                } else {
                    c[0] += padding0(d[1] - c[1])
                }
            }
            return operate(+c[0], +d[0], sign, k)
        }
    }
})();
