$(document).keydown(function(e) {
	if (e && 192 === e.keyCode && e.shiftKey && e.ctrlKey) {
		var $inGuidelines = $("#in_guidelines"),
			$forGuidelines = $(".for_guidelines"),
			$popupBox = ("#popup_box");

		if (!$inGuidelines.length) {
			var ctr = '<div id="in_guidelines" style="display:none;"><div id="guidelines"><div class="for_guidelines"><div class="col-edge-1"><div class="box"><p class="grid_p"></p></div></div><div class="col-1"><div class="box"><p class="grid_p"></p></div></div><div class="col-1"><div class="box"><p class="grid_p"></p></div></div><div class="col-1"><div class="box"><p class="grid_p"></p></div></div><div class="col-1"><div class="box"><p class="grid_p"></p></div></div><div class="col-edge-1"><div class="box"><p class="grid_p"></p></div></div></div></div></div>';
			$("body").prepend(ctr);
		}
		$inGuidelines.css("display", "none" === $inGuidelines.css("display") ? "block" : "none"), $(".left-padding-grid").length || ($forGuidelines.append('<div class="left-padding-grid"></div>'), $forGuidelines.append('<div class="right-padding-grid"></div>'));
	} else {
		if (!(e && 49 === e.keyCode && e.shiftKey && e.ctrlKey)) return;
		var popupBox = '<div id="popup_box" style="display:none"></div>', elems = $('i[id], input[type="submit"][id], button[type="submit"]');
		$popupBox.length || $("body").prepend(popupBox), elems.each(function() {
			var markedText = "I" == this.tagName ? $(this).parent() : $(this);
			markedText.hasClass("marked_text") && markedText.parent().hasClass("marked_text") ? markedText.removeClass("marked_text") : markedText.addClass("marked_text");
		}), $popupBox.css("display", "none" === $popupBox.css("display") ? "block" : "none");
	}
});
