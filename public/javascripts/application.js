$(document).ready(function() {
	$("#generator").live("click", function() {
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
			}
		});		
	}

	$(document).keypress(function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
 		if(code == 13 || code == 32) { //Enter keycode
 			e.preventDefault();
 			e.stopPropagation();
			getNewName();
 		}
	});

	function updateTwitter() {
  		var newName = $('.name_container .name').text();
		newName = newName.replace(/(\r\n|\n|\r)/gm,"");
  		newName = newName.replace(/ +(?= )/g,'');

  		if (newName.charAt(newName.length-1) === " " && 
  			newName.charAt(newName.length-2) === "S" &&
  			newName.charAt(newName.length-3) === " ") {
			newName = newName.replaceAt(newName.length-1, "");
  			newName = newName.replaceAt(newName.length-2, "");
  		}

		var newAnchor = $('<a>').attr({
		    'class': 'twitter-share-button',
		    'data-lang': 'en',
		    'href': "https://twitter.com/share?text=Apples Newest Product (prediction)!" + newName + ". Generated at "
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

String.prototype.replaceAt=function(index, c) {
	return this.substr(0, index) + c + this.substr(index + (c.length == 0 ? 1 : c.length));
}