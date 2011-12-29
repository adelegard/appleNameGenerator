$(document).ready(function() {

	updateTweetButtonText();

	$("#generator").live("click", function() {
		var $this = $(this);
		$this.die('click');
		getNewName();
	});

	var requestInProgress = false;
	var names = [];
	var namesIndex = 0;
	function getNewName() {
		if (requestInProgress === true) {
			return;
		}
		requestInProgress = true;
		$.ajax({
			url: "nn",
			type: "GET",
			success: function(data) {
		  		$(".name_container").html(data);
				updateTweetButtonText();
				names.unshift(data);
				names = names.splice(0, 10);
				namesIndex = 0;
			},
			error: function() {
				var html = "<div class=\"name dib\">" + getExistingName() + "</div>";
				$(".name_container").html(html);
			},
			complete: function() {
				// to prevent users spamming the server
				requestInProgress = false;
			}
		});
	}

	$(document).keyup(function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
 		if(code === 13 || code === 32) { //enter & spacebar
 			e.preventDefault();
 			e.stopPropagation();
			getNewName();
 		}
 		if(code === 37) { //left arrow
 			if (names.length <= namesIndex + 1) {
 				return false;
 			} else {
				namesIndex = namesIndex + 1;
 			}
	  		$(".name_container").html(names[namesIndex]);
			updateTweetButtonText();
 		}
 		if(code === 39) { //right arrow
			if (namesIndex <= 0) {
				getNewName();
				return false;
			}
			namesIndex = namesIndex - 1;
	  		$(".name_container").html(names[namesIndex]);
			updateTweetButtonText();
 		}
	});

	function getExistingName() {
  		var name = $('.name_container .name').text();
		name = name.replace(/(\r\n|\n|\r)/gm,"");
  		name = name.replace(/ +(?= )/g,'');

  		if (name.charAt(name.length-1) === " " && 
  			name.charAt(name.length-2) === "S" &&
  			name.charAt(name.length-3) === " ") {
			name = name.replaceAt(name.length-1, "");
  			name = name.replaceAt(name.length-2, "");
  		}
		name = trimLeadingAndTrailingWhitespace(name);
  		return name;
	}

	function updateTweetButtonText() {
		var newText = encodeURIComponent("#AppleGenerator " + getExistingName());
		var oldHref = jQuery("#tweet-button").attr("href");
		newHref = oldHref.replace(/&text=[^&]+/, "&text=" + newText);
		jQuery("#tweet-button, #tweet_name").attr("href", newHref);
	}

	twttr.ready(function (twttr) {
	    twttr.events.bind('click', function(event) {
			updateTweetButtonText();
	    });
	});
});

if (document.documentElement.attachEvent) {
    document.documentElement.attachEvent('onmousedown',function(){
         event.srcElement.hideFocus=true
    });
}

function trimLeadingAndTrailingWhitespace (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

String.prototype.replaceAt=function(index, c) {
	return this.substr(0, index) + c + this.substr(index + (c.length == 0 ? 1 : c.length));
}