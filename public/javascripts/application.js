$(document).ready(function() {
	$("#generator, .large_title").live("click", function() {
		var $this = $(this);
		$this.die('click');
		getNewName();
	});

	function getNewName() {
		$.ajax({
			url: "nn",
			type: "GET",
			success: function(data) {
		  		$(".name_container").html(data);
		  		updateTwitter();
			},
			error: function() {
				var html = "<div class=\"name dib\">" + getExistingName() + "</div>";
				$(".name_container").html(html);
			}
		});
	}

	$(document).keypress(function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
 		if(code == 13 || code == 32) { //enter & spacebar
 			e.preventDefault();
 			e.stopPropagation();
			getNewName();
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
  		return name;
	}

	function updateTwitter() {
		var newAnchor = $('<a>').attr({
		    'class': 'twitter-share-button',
		    'data-lang': 'en',
		    'href': "https://twitter.com/share?text=Apples Newest Product (prediction)!" + getExistingName() + ". Generated at "
		})[0];

		if ($(".social .twitter.1").is(":hidden")) {
			regenTwitterBtns(newAnchor, ".social .twitter.1", ".social .twitter.2");
		} else {
			regenTwitterBtns(newAnchor, ".social .twitter.2", ".social .twitter.1");
		}
	}

	function regenTwitterBtns(newAnchor, divHidden, divShown) {
		$(divHidden + " ").html(newAnchor);
		twttr.widgets.load();

		//give twitter's load method 1 second to reload things (to prevent visual flash of our new shown button)
		window.setTimeout(function() {  
		    $(divHidden + " ").show();
			$(divShown + " ").hide();
		}, 1000);
	}
});

if (document.documentElement.attachEvent) {
    document.documentElement.attachEvent('onmousedown',function(){
         event.srcElement.hideFocus=true
    });
}

String.prototype.replaceAt=function(index, c) {
	return this.substr(0, index) + c + this.substr(index + (c.length == 0 ? 1 : c.length));
}