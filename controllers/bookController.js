
/*
 * Book api controller
 */

var fs = require('fs');
var path = require('path');

var ROOT_PATH = global.config.ROOT_PATH;

exports.GetCategory = function(req, res){
  res.send();
};

exports.GetCategories = function(req, res){
	
	var categories = GetPathList(ROOT_PATH);
	
	res.send(categories);
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
	    		list.push({ name: name, page: idx, isFile: true });
	    	else
	    		list.push({ name: name, page: idx, isFile: false });
	    });
	}

	return list;
};