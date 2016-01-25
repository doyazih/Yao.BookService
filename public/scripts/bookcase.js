
var isInit = false;
var lastClickedPage;
var hashObj;

$(document).ready(function() {
	InitPage();
});

function InitPage()
{	
	var hash = document.location.hash;
	
	if(hash && hash != '' && hash.startsWith('#'))
		hashObj = hash.replace('#', '').replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];

	InitCollections();
	InitButton();
};

function InitCollections()
{
	$.ajax('/api/book/categories', {
		method: 'GET',
		success: function (data, status) {
			if(status == HTTP_RESPONSE_STATUS.Success) {

				if(data && Array.isArray(data) && data.length > 0) {
					data.forEach(function (category, idx) {
						
						var categoryName = category.Category;
						var categoryID = 'book-' + category.Seq;
						
						$('#aCollections').next().append('<li class="category">- <a id="' + categoryID + '" href="#category=' + categoryName + '" class="category">' + categoryName + '</a><ul class="toc_section" style="display:none"></ul></li>');
						
						$('#' + categoryID).click(function () {
							SetTitles(this);
						});
					});

					if(hashObj && hashObj.category) {
						var category = $('a.category').filter(function () {
							return $(this).text() == hashObj.category;
						});
						if (category && category.length > 0)
							category.trigger('click');
							
					}					
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
				if(status == HTTP_RESPONSE_STATUS.Success) {
					if(data && Array.isArray(data) && data.length > 0) {
						data.forEach(function (book, idx) {
							
							var bookTitle = book.Title;
							var bookTitleID = categoryID + '-' + book.Seq;
							
							$(e).next().append('<li class="title">&nbsp;&nbsp;- <a id="' + bookTitleID + '" href="#category=' + categoryName + '&title=' + bookTitle + '" class="title">' + bookTitle + '</a><ul class="toc_section" style="display:none"></ul></li>')			
						
							$('#' + bookTitleID).click(function() {
								SetVolumes(this);
							});
						});

						if(hashObj && hashObj.title) {
							var title = $('a.title').filter(function () {
								return $(this).text() == hashObj.title;
							});
							if (title && title.length > 0)
								title.trigger('click');
								
						}
					}
				}
			}
		});
		
		SetLable(categoryName);
		
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
				if(status == HTTP_RESPONSE_STATUS.Success) {
					if(data && Array.isArray(data) && data.length > 0) {
						data.forEach(function (vol, idx) {
							
							var volume = vol.Volume;
							var volumeID = bookTitleID + '-' + vol.Seq;

							$(e).next().append('<li class="volume">&nbsp;&nbsp;&nbsp;&nbsp;- <a id="' + volumeID + '" href="#category=' + categoryName + '&title=' + bookTitle + '&volume=' + volume + '" class="volume">' + volume + '</a><ul class="toc_section" style="display:none"></ul></li>')			

							$('#' + volumeID).click(function() {
								SetPages(this);
							});
						});

						if(hashObj && hashObj.volume) {
							var volume = $('a.volume').filter(function () {
								return $(this).text() == hashObj.volume;
							});
							if (volume && volume.length > 0)
								volume.trigger('click');
								
						}
					}
				}
			}
		});

		SetLable(categoryName, bookTitle);

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
				if(status == HTTP_RESPONSE_STATUS.Success) {
					if(data && Array.isArray(data) && data.length > 0) {
						data.forEach(function (p, idx) {
							
							var page = p.Page;
							var pageID = volumeID + '-' + p.Seq;

							$(e).next().append('<li class="page">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <a id="' + pageID + '" href="#category=' + categoryName + '&title=' + bookTitle + '&volume=' + volume + '&page=' + page + '" class="page">' + page + '</a></li>')			
						
							$('#' + pageID).click(function () {
								SetContent(this);
								lastClickedPage = $(this);
							});
						
						});

						if(hashObj && hashObj.page) {
							var page = $('a.page').filter(function () {
								return $(this).text() == hashObj.page;
							});
							if (page && page.length > 0)
								page.trigger('click');
								
						}
					}
				}
			}
		});
		SetLable(categoryName, bookTitle, volume);
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
	
	SetLable(categoryName, bookTitle, volume, page);
	
	$('#imgContent').attr('src', imgLink);
	
};

function SetLable(category, title, volume, page) {
	var lableInfo = '';
	
	if(category)
		lableInfo += (category);
	
	if(title)
		lableInfo += ('/' + title);
	
	if(volume)
		lableInfo += ('/' + volume);
	
	if(page)
		lableInfo += ('/' + page);
	
	$('#lableContentInfo').text(lableInfo);
	
};

function GoNextPage() {
	var nextPage = lastClickedPage.parent().next().find('.page');
	
	if(!nextPage || nextPage.length == 0)
		alert('Last page\nPlease go next volume.');
	else
		nextPage.trigger('click');
};

function BackPrevPage() {
	var prevPage = lastClickedPage.parent().prev().find('.page');
	
	if(!prevPage || prevPage.length == 0)
		alert('First page\nPlease go next page.');
	else
		prevPage.trigger('click');
};

function InitButton() {
	
	$('#imgContent').click(function (e) {
		GoNextPage();
	});
	
	$('#aNextPage').click(function (e) {
		GoNextPage();
	});
	
	$('#aPrevPage').click(function (e) {
		BackPrevPage();
	});
	
	$('#aSideMenuToggle').click(function (e) {
		
		if($('#sidebar').css('display') == 'none') {
			$('div.container').css('margin', '5px 0 50px 230px');
		}
		else {
			$('div.container').css('margin', '5px 0 50px 10px');
		}
		$('#sidebar').toggle(200);
	});
};
