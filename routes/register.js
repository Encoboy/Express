const User = require('../models/user');
//输出渲染注册模板的路由
exports.form = (req,res) => {
  console.log('res:',res.locals.user);
  res.render('register',{title:'Register'})
};

//用提交的数据来创建用户
exports.submit = (req,res,next) => {
  const data = req.body.user;
  User.getByName(data.name,(err,user)=>{
    if(err) return next(err);
    //redis will default it
    if(user.id){
      res.error('Username already taken!');
      res.redirect('back');
    }else{
      user = new User({
        name:data.name,
        pass:data.pass
      });
      user.save((err)=>{
        if(err) return next(err);
        console.log('registerId',user.id);
        req.session.uid = user.id;
        res.redirect('/');
      })
    }
  })
};