
/*
 * Book api controller
 */
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

var COMICS_ROOT_PATH = global.config.COMICS_ROOT_PATH;

var Categories = [
                  {
                	  Seq: 1,
                	  Category: 'Comics'
                  }
                 ];


exports.GetCategories = function(req, res){
	
	var categories = Categories;

	res.send(categories);
};

exports.GetTitles = function(req, res){
	
	var category = req.params.Category;
	
	var titles = new Array();
	
	if(category == 'Comics')
		titles = GetPathList(COMICS_ROOT_PATH);
	
	titles = _.filter(titles, function (item) {
		return !item.IsFile;
	});
	
	titles = _.map(titles, function (item) {
		return {
			Seq: item.Seq,
			Title: item.Name
		};
	});
	
	res.send(titles);
};

exports.GetVolumes = function (req, res) {
	var category = req.params.Category;
	var title = req.params.Title;
	
	var volumes = new Array();
	if(category == 'Comics') {
		var comicPath = path.join(COMICS_ROOT_PATH, title);
		volumes = GetPathList(comicPath);
	}
	
	volumes = _.filter(volumes, function (item) {
		return !item.IsFile;
	});
	
	volumes = _.map(volumes, function (item) {
		return {
			Seq: item.Seq,
			Volume: item.Name
		};
	});
	
	res.send(volumes);
};

exports.GetPages = function (req, res) {
	var category = req.params.Category;
	var title = req.params.Title;
	var volume = req.params.Volume;
	
	var pages = new Array();
	if(category == 'Comics') {
		var comicPath = path.join(COMICS_ROOT_PATH, title, volume);
		pages = GetPathList(comicPath);
	}
	
	pages = _.filter(pages, function (item) {
		return item.IsFile;
	});
	
	pages = _.map(pages, function (item) {
		return {
			Seq: item.Seq,
			Page: item.Name
		};
	});
	
	res.send(pages);
};

var chunkRgx = /(_+)|([0-9]+)|([^0-9_]+)/g;
function CompareNaturally(a, b) {
    var ax = [], bx = [];
    
    a.replace(chunkRgx, function(_, $1, $2, $3) {
        ax.push([$1 || "0", $2 || Infinity, $3 || ""])
    });
    b.replace(chunkRgx, function(_, $1, $2, $3) {
        bx.push([$1 || "0", $2 || Infinity, $3 || ""])
    });
    
    while(ax.length && bx.length) {
        var an = ax.shift();
        var bn = bx.shift();
        var nn = an[0].localeCompare(bn[0]) || 
                 (an[1] - bn[1]) || 
                 an[2].localeCompare(bn[2]);
        if(nn) return nn;
    }
    
    return ax.length - bx.length;
};


var availableExt = ['.jpg', '.png'];

function GetPathList(p) {
	
	var list = new Array();
	var readList = fs.readdirSync(p);
	
	var idx = 0;
	
	if (readList && Array.isArray(readList) && readList.length > 0)
	{
		readList.sort(CompareNaturally).map(function (item) {
	        return path.join(p, item);
	    }).filter(function (fullPath) {
	        return (fs.statSync(fullPath).isDirectory() 
	        		|| (fs.statSync(fullPath).isFile() && availableExt.indexOf(path.extname(fullPath) >= 0))
	        		);
	    }).forEach(function (dirPath) {
	    	
	    	idx++;
	    	
	    	var name = dirPath.replace(p, '').replace('\\', '').replace('/', '');
	    	
	    	if(fs.statSync(dirPath).isFile())
	    		list.push({ Name: name, Seq: idx, IsFile: true });
	    	else
	    		list.push({ Name: name, Seq: idx, IsFile: false });
	    });
	}

	return list;
};

exports.GetPage = function (req, res){
	
	var category = req.params.Category;
	var title = req.params.Title;
	var volume = req.params.Volume;
	var page = req.params.Page;
	
	var pagePath;

	if(category == 'Comics')
		pagePath = path.join(COMICS_ROOT_PATH, title, volume, page);
	
	res.sendfile(pagePath);
};