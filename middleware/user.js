const User = require('../models/user');

// module.exports = (req,res,next) => {
//     const uid = req.session.uid;
//     console.log('middlewareUserUid:',uid);
//     if(!uid) return next();
//     User.get(uid,(err,user)=>{
//         if(err) return next(err);
//         req.user = res.locals.user = user;
//         next();
//     })
// };

module.exports = (req,res,next) => {
  console.log('middelewareUserRemoteUser:',req.remoteUser);
  if(req.remoteUser){
      res.locals.user = req.remoteUser;
  }
  const uid = req.session.uid;
  if(!uid) return next();
  User.get(uid,(err,user)=>{
      if(err) return next(err);
      req.user = res.locals.user = user;
      next();
  })
};