const item = require('../models/item');

//check if user is guest
exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        next();
    }
    else{
        req.flash('error', 'You are logged in already.');
        return res.redirect('/users/profile');
    }
};

exports.isLoggedIn = (req, res, next)=>{
    if(req.session.user){
        next();
    }
    else{
        req.flash('error', 'You need to login first.');
        return res.redirect('/users/login');
    }
};

exports.isSeller = (req, res, next)=>{
    let id = req.params.id;
    item.findById(id)
    .then(item=>{
        if(item){
            if(item.seller == req.session.user){
                next();
            }
            else{
                req.flash('error', 'You are not authorized to perform this operation');
                return res.redirect('back');
            }
        }
        else{
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.isNotSeller = (req, res, next)=>{
    let id = req.params.id;
    item.findById(id)
    .then(item=>{
        if(item){
            if(item.seller != req.session.user){
                next();
            }
            else{
                req.flash('error', 'You cannot buy your own item.');
                return res.redirect('back');
            }
        }
        else{
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

// exports.isBuyer = (req, res, next)=>{
//     let id = req.params.id;
//     item.findById(id)
//     .then(item=>{
//         if(item){
//             if(item.buyer == req.session.user){
//                 next();
//             }
//             else{
//                 req.flash('error', 'You are not authorized to perform this operation');
//                 return res.redirect('back');
//             }
//         }
//         else{
//             let err = new Error('Cannot find an item with id ' + id);
//             err.status = 404;
//             next(err);
//         }
//     })
//     .catch(err=>next(err));
// };