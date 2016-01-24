
var isInit = false;

$(document).ready(function() {
	InitPage();
});

function InitPage()
{
	InitCollections();
};

function InitCollections()
{
	$.ajax('/api/book/categories', {
		method: 'GET',
		success: function (data, status) {
			if(status == 'success') {

				if(data && Array.isArray(data) && data.length > 0) {
					data.forEach(function (category, idx) {
						
						var categoryName = category.Category;
						var categoryID = 'book-' + category.Seq;
						
						$('#aCollections').next().append('<li class="category">- <a id="' + categoryID + '" href="#" class="category">' + categoryName + '</a><ul class="toc_section" style="display:none"></ul></li>');
						
						$('#' + categoryID).click(function () {
							SetTitles(this);
						});
					});
					
				}
			}
		}
	})
};

function SetTitles(e) {

	if($(e).next().css('display') == 'none') {
		
		var categoryName = $(e).text();
		var categoryID = $(e).attr('id');
		
		$.ajax('/api/book/categories/' + categoryName + '/titles', {
			method: 'GET',
			success: function (data, status) {
				if(status == 'success') {
					if(data && Array.isArray(data) && data.length > 0) {
						data.forEach(function (book, idx) {
							
							var bookTitle = book.Title;
							var bookTitleID = categoryID + '-' + book.Seq;
							
							$(e).next().append('<li class="title">&nbsp;&nbsp;- <a id="' + bookTitleID + '" href="#" class="title">' + bookTitle + '</a><ul class="toc_section" style="display:none"></ul></li>')			
						
							$('#' + bookTitleID).click(function() {
								SetVolumes(this);
							});
						});
					}
				}
			}
		});
		
		$(e).next().show();
	}
	else {
		$(e).next().hide();		
		$(e).next().empty();
	}
};

function SetVolumes(e) {

	if($(e).next().css('display') == 'none') {
		
		var categoryName = $(e).parent().parent().prev().text();
		
		var bookTitle = $(e).text();
		var bookTitleID = $(e).attr('id');
		
		$.ajax('/api/book/categories/' + categoryName + '/titles/' + bookTitle + '/volumes', {
			method: 'GET',
			success: function (data, status) {
				if(status == 'success') {
					if(data && Array.isArray(data) && data.length > 0) {
						data.forEach(function (vol, idx) {
							
							var volume = vol.Volume;
							var volumeID = bookTitleID + '-' + vol.Seq;

							$(e).next().append('<li class="volume">&nbsp;&nbsp;&nbsp;&nbsp;- <a id="' + volumeID + '" href="#" class="volume">' + volume + '</a><ul class="toc_section" style="display:none"></ul></li>')			

							$('#' + volumeID).click(function() {
								SetPages(this);
							});
						});
					}
				}
			}
		});
		

		$(e).next().show();
	
	}
	else {
		$(e).next().hide();		
		$(e).next().empty();
	}
};


function SetPages(e) {

	if($(e).next().css('display') == 'none') {
		
		var categoryName = $(e).parent().parent().parent().parent().prev().text();
		var bookTitle = $(e).parent().parent().prev().text();
		
		var volume = $(e).text();
		var volumeID = $(e).attr('id');
		
		$.ajax('/api/book/categories/' + categoryName + '/titles/' + bookTitle + '/volumes/' + volume + '/pages', {
			method: 'GET',
			success: function (data, status) {
				if(status == 'success') {
					if(data && Array.isArray(data) && data.length > 0) {
						data.forEach(function (p, idx) {
							
							var page = p.Page;
							var pageID = volumeID + '-' + p.Seq;

							$(e).next().append('<li class="page">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <a id="' + pageID + '" href="#" class="page">' + page + '</a></li>')			
						
							$('#' + pageID).click(function () {
								SetContent(this);
							});
						
						});
					}
				}
			}
		});
		
		$(e).next().show();
	}
	else {
		$(e).next().hide();		
		$(e).next().empty();
	}
};

function SetContent(e) {
	
	var categoryName = $(e).parents('.category').find('a.category').text();
	var bookTitle = $(e).parents('.title').find('a.title').text();
	var volume = $(e).parents('.volume').find('a.volume').text();
	var page = $(e).parents('.page').find('a.page').text();
	
	var imgLink = 'http://' + document.location.host + '/api/book/categories/' + categoryName + '/titles/' + bookTitle + '/volumes/' + volume + '/pages/' + page;
	
	$('#imgContent').attr('src', imgLink);
	
};

function InitButton() {
	
	if(isInit)
		return;
	else {	
		isInit = true;
		$('.category, .book-title, .volume').click(function (e) {
			
			var list = $(this).next();
			
			if(list.css('display') == 'none')
				list.show();
			else
				list.hide();
		});	
	}

};
