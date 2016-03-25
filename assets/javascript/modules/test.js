(function($) {
    "use strict";
    var test = {
        elem: $('.test'),
        init: function() {
            this.doactionA();
            this.doactionB();
        },
        doactionA: function() {
            this.elem.on('click', function(e) {
                console.log("doactionA");
            });
        },
        doactionB: function() {
            this.elem.on('click', function(e) {
                console.log("doactionB");
            });
        }
    };
    window.test = test;
})(jQuery);