actiGuide.mainModule.factory('$caretPosition', function () {
    return {
        get: "selection" in document ? getCaretPositionForIe : getCaretPosition,
        set: document.createElement("input").createTextRange ? setCaretPositionForIe : setCaretPosition,
        $get: $getCaretPosition,
        $set: $setCaretPosition
    };

    function getCaretPosition(element) {
        return element ? element.selectionStart : null;
    }

    function getCaretPositionForIe(element) {
        if (!element) return null;

        element.focus();

        var selection = document.selection.createRange();
        selection.moveStart("character", -element.value.length);
        return selection.text.length;
    }

    function setCaretPosition(element, position) {
        if (!element) return false;

        element.focus();
        try { // try/catch ???
            element.setSelectionRange(position, position);
        } catch (e) {

        }
        return true;
    }

    function setCaretPositionForIe(element, position) {
        if (!element) return false;
        if (!position) return false;

        element.focus();

        var range = element.createTextRange();
        range.collapse(true);
        range.moveEnd("character", position);
        range.moveStart("character", position);
        range.select();
        return true;
    }

    function $getCaretPosition($element) {
        return this.get($element.get(0));
    }

    function $setCaretPosition($element, position) {
        return this.set($element.get(0), position);
    }
});