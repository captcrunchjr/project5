const User = require('../models/user');
const items = require('../models/item');
const Offer = require('../models/offer');

exports.new = (req, res) => {
    res.render('./user/new');
};

exports.create = (req, res, next) => {
    let user = new User(req.body);
    console.log(user);
    user.save()
    .then(user => {res.redirect('users/login')})
    .catch(err => {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            res.redirect('/users/new');
        }
        if(err.code === 11000) {
            req.flash('error', 'email already exists');
            res.redirect('/users/new');
        }
        next(err);
    });
};

exports.getUserLogin = (req, res, next) => {
    res.render('./user/login');
};

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({email})
    .then(user => {
        if(!user) {
            req.flash('error', 'Invalid email');
            res.redirect('/users/login');
        }
        else{
            user.comparePassword(password)
            .then(isMatch => {
                if(!isMatch) {
                    req.flash('error', 'Invalid password');
                    res.redirect('/users/login');
                }
                else{
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
                }
            });
        }
    })
        .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([User.findById(id), items.find({seller: id}), Offer.find({buyer: id}).populate('item')])
    .then(results => {
        const [user, items, offers] = results;
        res.render('./user/profile', {user, items, offers});
    })
    .catch(err => next(err));
};

exports.logout = (req, res, next) => {
    req.session.destroy(err =>{
        if(err)
            return next(err);
        else
            res.redirect('/');
    });
};