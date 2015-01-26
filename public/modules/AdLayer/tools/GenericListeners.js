/**
 * Created by Patrick W Larsen
 * Modified script from http://remysharp.com/2009/01/26/element-in-view-event-plugin/
 */
(function ($) {
    function getVpH() {
        var h = window.innerHeight, m = document.compatMode;
        if((m || !$.support.boxModel)) h = (m == 'CSS1Compat') ? document.documentElement.clientHeight : document.body.clientHeight;
        return h;
    }
    $(window).scroll(function() {
        var vpH = getVpH(), sT = (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop), els = [];
        $.each($.cache, function(){
            if(this.events && this.events.inview) els.push(this.handle.elem);
        });
        if(els.length){
            $(els).each(function(){
                var $e = $(this), top = $e.offset().top, h = $e.height(), inview = $e.data('inview') || false;
                if(sT > (top + h) || sT + vpH < top){ if(inview){ $e.data('inview', false); $e.trigger('inview', [ false ]); } }
                else if(sT < (top + h)){ if(!inview){ $e.data('inview', true); $e.trigger('inview', [ true ]); } }
            });
        }
    });
    $(function(){
        $(window).scroll();
    });
})(jQuery);

/**
 * Adds an 'onShownOnce' listener to the element.
 * Once the element is visible in the viewport, the callbackFunction will be run.
 * @param elementId - id of the element to add listener to.
 * @param callbackFunction - function to be called once the element is shown.
 * Created by Patrick W Larsen
 */
function addOnShownOnceListener(elementId, callbackFunction) {
    $(elementId).one('inview', function() {
        callbackFunction();
    });
}

/**
 * Adds an 'onVisible' listener to the element.
 * Every time the element becomes visible in the viewport, the callbackFunction will be run.
 * @param elementId - id of the element to add listener to.
 * @param callbackFunction - function to be called once the element is shown.
 * Created by Patrick W Larsen
 */
function addOnVisibleListener(elementId, callbackFunction) {
    $(elementId).bind('inview', function(event, visible) {
       if(visible == true) {
           callbackFunction();
       }
    });
}

/**
 * Adds an 'onClick' listener to the element.
 * Every time the element is clicked, the callbackFunction will be run.
 * @param elementId - id of the element to add listener to
 * @param callbackFunction - function to be called once the element is shown.
 * Created by Patrick W Larsen
 */
function addOnClickListener(elementId, callbackFunction) {
    $(elementId).click(callbackFunction);
}

