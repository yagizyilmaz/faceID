$('#result-box-1').masonry({
	itemSelector: '.photo',
	columnWidth: 80
});

$('#result-box-2').masonry({
	itemSelector: '.photo',
	columnWidth: 80
});

function tidy(option, div) {
	$(div).imagesLoaded(function (){
		$(div).masonry('reloadItems');
		$(div).masonry({ columnWidth: 80, itemSelector: '.photo', gutter: 10});
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

$("#attrButton").on("click", function () {
	$("#attributes").slideToggle();
});


var cat1 = [];
var cat2 = [];
var obj;

$("body").on("click", "#coll > button", function() { 
	//console.log($(this).attr('id'));
	$("#attributes").slideUp(250);
	var data = $(this).attr('id');
	console.log(data);
	$.ajax({
		async: false,
		type: 'POST',
		url: '/results/get',
		data: '{"data": "' + data + '"}',
		contentType: "application/json; charset=utf-8",
		success: function(result) {
      		 //$( '#div' ).val( resp.currency[0].amount );
      		 obj = result;
      		 //console.log(obj["Path"]);
   		},
   		dataType: 'json'
	});
	console.log(data);
	/*for(var i = 0; i < obj.length; i++) {
		if(obj[i][data] === 1) cat1.push(obj[i].Path);
		else cat2.push(obj[i].Path);
	}*/

	for(var i = 0; i < obj.length; i++) {
		if(obj[i][data] === 1) {
			cat1.push(obj[i].Path);
			$("#result-box-1").append("<div class='photo'><a data-toggle='popover' "
						+ "><i class='' aria-hidden='true' ></i></i><img src='/images/" 
						+ obj[i].Path + "'></a></div>");
					tidy("update", "#result-box-1");
		}
		else {
			cat2.push(obj[i].Path);
			$("#result-box-2").append("<div class='photo'><a data-toggle='popover' "
						+ "><i class='' aria-hidden='true' ></i></i><img src='/images/" 
						+ obj[i].Path + "'></a></div>");
					tidy("update", "#result-box-1");
		}
	}




});