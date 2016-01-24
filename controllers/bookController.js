
exports.Index = function (req, res){
  res.render('bookcase/index', { title: 'Yao\'s book case' });
};


exports.Introduction = function (req, res){
  res.render('bookcase/introduction', { title: 'Yao\'s book case' });
};