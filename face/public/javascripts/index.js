$('#result-box-1').masonry({
	itemSelector: '.photo',
	columnWidth: 100,
	transitionDuration: 800
});

$('#result-box-2').masonry({
	itemSelector: '.photo',
	columnWidth: 100,
	originLeft: false,
	transitionDuration: 800
});

function tidy(option, div) {
	$(div).imagesLoaded(function (){
		$(div).masonry('reloadItems');
		$(div).masonry({ columnWidth: 100, itemSelector: '.photo', gutter: 10});
	});
}

function init() {
	$.getJSON('/results/attr', function(data) {
		$.each(data, function() {
			$("#coll").append("<button id=" + this.COLUMN_NAME + ">" + this.COLUMN_NAME.replace(/_/g, ' ') + "</button>");
		});
	});
};

init();

function print(page, cat) {
	switch (cat) {
		case 1:
		$("#result-box-1").html("");
		for(var i = (page-1)*50; i < page*50; i++) {
			if(cat1[i] != undefined)
					//$("#result-box-1").append("<p>" + cat1[i] + "</p>"); //DEBUG
				$("#result-box-1").append("<div class='photo'><a data-toggle='popover' "
					+ "><i class='' aria-hidden='true' ></i></i><img src='/images/" 
					+ cat1[i] + "'></a></div>");
				tidy("update", "#result-box-1");
			}
			break;
			case 2:
			$("#result-box-2").html("");
			for(var i = (page-1)*50; i < page*50; i++) { 
				if(cat2[i] != undefined)
				//$("#result-box-2").append("<p>" + cat2[i] + "</p>"); // DEBUG
			$("#result-box-2").append("<div class='photo'><a data-toggle='popover' "
				+ "><i class='' aria-hidden='true' ></i></i><img src='/images/" 
				+ cat2[i] + "'></a></div>");
			tidy("update", "#result-box-2");
		}
			//console.log('2');
			break;
		}
	}


///////// "ATTRIBUTES" BUTTON ON NAVBAR ////////////////
$("#attrButton").on("click", function () { $("#attributes").slideToggle(); });
////////////////////////////////////////////////////////

var page = 1;
var cat1 = [];
var cat2 = [];
var obj;
var toServer = [];
var yesArr = [];
var noArr = [];

$("#prev-page").on("click", function() {
	yesArr = [];
	noArr = [];
	if(page > 1) page--;
	$("body > nav:nth-child(3) > ul > li:nth-child(2) > input[type='text']").val(page);
	print(page,1);
	print(page,2);
});

$("#next-page").on("click", function() {
	yesArr = [];
	noArr = [];
	if(page < Math.max(cat1.length, cat2.length)/50) page++; 
	$("body > nav:nth-child(3) > ul > li:nth-child(2) > input[type='text']").val(page);
	print(page,1);
	print(page,2);
});

$("body").on("change", "#page-number", function() { 
	yesArr = [];
	noArr = [];
	if(($(this).val() < Math.max(cat1.length, cat2.length)/50) && $(this).val() >= 1) page = $(this).val();
	else if ($(this).val() < 1) page = 1;
	else page = Math.ceil(Math.max(cat1.length, cat2.length)/50);
	$("body > nav:nth-child(3) > ul > li:nth-child(2) > input[type='text']").val(page);
	print(page,1);
	print(page,2);
});

$("body").on("click", "#coll > button", function() {
	cat1 = [];
	cat2 = [];
	yesArr = [];
	noArr = [];
	page = 1;
	$("body > nav:nth-child(3) > ul > li:nth-child(2) > input[type='text']").val(page);
	$("#attributes").slideUp(250);
	var data = $(this).attr('id');
	//console.log(data);
	$("#result-box-1").html("");
	$("#result-box-2").html("");
	$.ajax({
		async: false,
		type: 'POST',
		url: '/results/get',
		data: '{"data": "' + data + '"}',
		contentType: "application/json; charset=utf-8",
		success: function(result) { obj = result; },
		dataType: 'json'
	});

	toServer[0] = data; // will be sent to server to identify what to be changed

	$("#results-header").html("\"" + data.replace(/_/g, ' ') + "\" selected."); // Indicate selected attribute
	for(var i = 0; i < obj.length; i++) { 
		if(obj[i][data] === 1) cat1.push(obj[i].Path);
		else cat2.push(obj[i].Path);
	}
	print(1,1);
	print(1,2);
});


///////// PHOTO CLICK EVENT /////////////
$("body").on("click", ".photo img", function() { 
	$(this).closest(".photo").toggleClass("selected-img"); // "selected" indicator
	if($(this).closest("div").parent().attr("id") === "result-box-1") { // if cat1 add to "yesArr"
		//console.log('from1');
	if ($(this).closest(".photo").hasClass("selected-img")) {
			yesArr.push($(this).attr("src").substring(8)); // add non-existing entry
		} else {
			if (yesArr.indexOf($(this).attr("src").substring(8)) > -1) {
				yesArr.splice(yesArr.indexOf($(this).attr("src").substring(8)), 1); // delete existing entry
			}
		}
	} else if($(this).closest("div").parent().attr("id") === "result-box-2") { // if cat2 add to "noArr"
		//console.log('from2');
		if ($(this).closest(".photo").hasClass("selected-img")) {
			noArr.push($(this).attr("src").substring(8)); // add non-existing entry
		} else {
			if (noArr.indexOf($(this).attr("src").substring(8)) > -1) {
				noArr.splice(noArr.indexOf($(this).attr("src").substring(8)), 1); // delete existing entry
			}
		}
	}
});
///////////////////////////////////////////////

///////// MOVE BUTTON CLICK EVENT /////////////
$("body").on("click", "#move", function() {
	//console.log('noob noob');
	toServer[1] = yesArr;
	toServer[2] = noArr;
	if(toServer[1].length != 0 || toServer[2].length != 0) {
		//console.log('oluru var');
		$.ajax({
			type: 'POST',
			url: '/results/update',
			data: JSON.stringify(toServer),
			contentType: "application/json; charset=utf-8",
			dataType: 'json'
		});
	}
	$("#result-box-1").html("");
	$("#result-box-2").html("");
	cat1 = [];
	cat2 = []; 
	$.ajax({
		async: false,
		type: 'POST',
		url: '/results/get',
		data: '{"data": "' + toServer[0] + '"}',
		contentType: "application/json; charset=utf-8",
		success: function(result) { obj = result; },
		dataType: 'json'
	});
	for(var i = 0; i < obj.length; i++) { 
		if(obj[i][toServer[0]] === 1) cat1.push(obj[i].Path);
		else cat2.push(obj[i].Path);
	}
	yesArr = [];
	noArr = []; 
	print(page,1);
	print(page,2);
});
///////////////////////////////////////////////





