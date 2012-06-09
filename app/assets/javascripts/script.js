$(document).ready(function() {

	updateTweetButtonText();

	$("#generator").click(function() {
		getNewName();
		_gaq.push(['_trackEvent', 'click', 'generate', '']);
	});

	$(".name_container").delegate(".name", "hover", function() {
		$(this).find(".letter_border:visible").toggleClass("letter_border_hover");
		$(this).find(".letter_border_two:visible").toggleClass("letter_border_two_hover");
		$(this).find(".letter_container:visible").toggleClass("letter_container_hover");
	});

	$(".um_why .why").click(function() {
		$(".reason_container").slideToggle('fast');
	})

	var requestInProgress = false;
	var names = [];
	var namesIndex = 0;
	function getNewName() {
		if (requestInProgress === true) {
			return;
		}
		var url = "nn";
		//var synonym = $("input.synonym").val();
		requestInProgress = true;
		$.ajax({
			url: "nn",
			//data: {'s': synonym},
			type: "GET",
			success: function(data) {
				setNewName(data);
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
 		if(code === 13) { //enter
			getNewName();
			_gaq.push(['_trackEvent', 'key_press', '13', 'enter']);
 		}
 		else if (code === 37 || code === 65) { //left arrow
			_gaq.push(['_trackEvent', 'key_press', '37', 'left arrow']);
 			if (names.length <= namesIndex + 1) {
 				return false;
 			} else {
				namesIndex = namesIndex + 1;
 			}
 			setNewName(names[namesIndex]);
 		}
 		else if (code === 39 || code === 68) { //right arrow
			_gaq.push(['_trackEvent', 'key_press', '39', 'right arrow']);
			if (namesIndex <= 0) {
				getNewName();
				return false;
			}
			namesIndex = namesIndex - 1;
	  		setNewName(names[namesIndex]);
 		}
	});

	function setNewName(name) {
		$(".name_container").html(name);
		updateTweetButtonText();
	}

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
		var oldHref = jQuery("#tweet_name").attr("href");
		newHref = oldHref.replace(/&text=[^&]+/, "&text=" + newText);
		jQuery("#tweet-button, #tweet_name").attr("href", newHref);
	}

	twttr.ready(function (twttr) {
	    twttr.events.bind('click', function(event) {
			updateTweetButtonText();
			_gaq.push(['_trackEvent', 'click', 'generated name', '']);
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