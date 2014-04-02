$(document).keydown(function(e) {
	if (e && 192 === e.keyCode && e.shiftKey && e.ctrlKey) {
		if (!$("#in_guidelines").length) {
			var ctr = '<div id="in_guidelines" style="display:none;"><div id="guidelines"><div class="for_guidelines"><div class="col-edge-1"><div class="box"><p class="grid_p"></p></div></div><div class="col-1"><div class="box"><p class="grid_p"></p></div></div><div class="col-1"><div class="box"><p class="grid_p"></p></div></div><div class="col-1"><div class="box"><p class="grid_p"></p></div></div><div class="col-1"><div class="box"><p class="grid_p"></p></div></div><div class="col-edge-1"><div class="box"><p class="grid_p"></p></div></div></div></div></div>';
			$("body").prepend(ctr);
		}
		var grid = $("#in_guidelines");
		grid.css("display", "none" === grid.css("display") ? "block" : "none"), $(".left-padding-grid").length || ($(".for_guidelines").append('<div class="left-padding-grid"></div>'),
		$(".for_guidelines").append('<div class="right-padding-grid"></div>'));
	} else {
		if (!(e && 49 === e.keyCode && e.shiftKey && e.ctrlKey)) return;
		var popupBox = '<div id="popup_box" style="display:none"></div>', elems = $('i[id], input[type="submit"][id], button[type="submit"]');
		$("#popup_box").length || $("body").prepend(popupBox), elems.each(function() {
			var markedText = "I" == this.tagName ? $(this).parent() : $(this);
			markedText.hasClass("marked_text") && markedText.parent().hasClass("marked_text") ? markedText.removeClass("marked_text") : markedText.addClass("marked_text");
		}), $("#popup_box").css("display", "none" === $("#popup_box").css("display") ? "block" : "none");
	}
});
