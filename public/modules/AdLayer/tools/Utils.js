/**
 * Takes the array of objects and sorts the objects by a given property.
 * @param array - the array of objects to be sorted
 * @param property - the property the objects are to be sorted by
 * Created by Patrick W Larsen
 */
function sortByProperty(array, property) {
    array.sort(sortByProp(property));
    function sortByProp(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function(a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property] ? 1 : 0);
            return result * sortOrder;
        }
    }
}

/**
 * WORK IN PROGRESS
 *
 * The idea of this method is to take a text and use its font-size and font-faily to determine the width in pixels.
 * Then if the texts width in pixels is greater than maxWidth, the function will remove characters until the text
 * plus three dots are less than or equal to maxWidth.
 *
 * Started working on this because it might be needed for the select 'dropdown' menus in SignUp and ProfileSettings.
 *
 * @param text
 * @param font
 * @param maxWidth
 * @returns {*}
 *
 * Created by Patrick W Larsen
 */
function shortenText(text, font, maxWidth) {
    var dotLength = getTextWidth('...', font);
    var maxTextWidth = maxWidth-dotLength;
    if(getTextWidth(text, font) <= maxWidth) return text;
    else {
        return removeLastCharTillOk(text.substr(0, text.length-1), font, maxWidth);
    }
    function getTextWidth(text, font) {
        if (!getTextWidth.fakeEl) getTextWidth.fakeEl = $('<span>').hide().appendTo(document.body);
        getTextWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
        return getTextWidth.fakeEl.width();
    }
    function removeLastCharTillOk(text, font, maxWidth) {
        var dotLength = getTextWidth('...', font);
        var maxTextWidth = maxWidth-dotLength;
        if(getTextWidth(text, font) <= maxTextWidth) return text + '...';
        return removeLastCharTillOk(text.substr(0, text.length-1), font, maxWidth);
    }
}