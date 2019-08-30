const User = require('../models/user');
//显示登陆表单页面
exports.form = (req,res) => {
    res.render('login',{title:'Login'})
};

exports.submit = (req,res,next) =>{
    const data = req.body.user;
    console.log('loginData:',data);
    User.authenticate(data.name,data.pass,(err,user)=>{
        if(err) return next(err);
        console.log('loginUser:',user);
        if(user){
            req.session.uid = user.id;
            res.redirect('/');
        }else {
            res.error('Sorry! invalid credentials.');
            res.redirect('back');
        }
    })
};

exports.logout = (req,res)=> {
    console.log('logout!!!!');
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/');
    })
};

