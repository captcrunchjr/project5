var Offer = require('../models/offer');
var Item = require('../models/item');
var User = require('../models/user');

exports.new = function(req, res, next) {
    let id = req.params.id;
    Item.findById(id).populate('seller', 'firstName lastName')
        .then(item => {
            if(item){
                res.render('./offers/new', { item: item });
            } else {
                let err = new Error('Item not found');
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

exports.create = function(req, res, next) {
    let id = req.params.id;
    Item.findById(id)
        .then(item => {
            if(item){
                let amount = Number(req.body.amount);
                if (isNaN(amount)) {
                    let err = new Error('Invalid amount');
                    err.status = 400;
                    next(err);
                } else {
                    let offer = new Offer({
                        item: item._id,
                        buyer: req.session.user,
                        seller: item.seller,
                        amount: amount,
                    });
                    offer.save()
                    .then((offer) => {
                        return Item.findByIdAndUpdate(id, 
                            {
                                $inc: { totalOffers: 1 },
                                $max: { highestOffer: offer.amount }
                            }, 
                            { new: true });
                    })
                    .then((item) => res.redirect('/items/view/' + item._id))
                    .catch(err => {
                        if(err.name === 'ValidationError'){
                            err.status = 400;
                        }
                        next(err);
                    });
                }
            } else {
                let err = new Error('Item not found');
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

exports.accept = function(req, res, next) {
    let offerId = req.params.offerId;
    Offer.findById(offerId)
        .then(offer => {
            if(offer){
                offer.status = 'Accepted';
                offer.save()
                    .then(() => {
                        Item.findById(offer.item)
                            .then(item => {
                                if(item){
                                    item.active = false;
                                    item.save()
                                        .then(() => {
                                            Offer.updateMany({ item: item._id, _id: { $ne: offer._id } }, { status: 'Rejected' })
                                                .then(() => res.redirect(`/items/${item._id}/offer/viewAll`))
                                                .catch(err => next(err));
                                        })
                                        .catch(err => next(err));
                                } else {
                                    let err = new Error('Item not found');
                                    err.status = 404;
                                    next(err);
                                }
                            })
                            .catch(err => next(err));
                    })
                    .catch(err => next(err));
            } else {
                let err = new Error('Offer not found');
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

exports.view = function(req, res, next) {
    let offerId = req.params.offerId;
    Offer.findById(offerId).populate('item', 'name').populate('buyer', 'firstName lastName')
        .then(offer => {
            if(offer){
                res.render('./offers/view', { offer: offer });
            } else {
                let err = new Error('Offer not found');
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

exports.viewAll = function(req, res, next) {
    let itemid = req.params.id;
    Item.findById(itemid)
        .then(item => {
            if(item){
                Offer.find({item: itemid}).populate('buyer', 'firstName lastName')
                    .then(offers => {
                        res.render('./offers/viewAll', {item: item, offers: offers });
                    })
                    .catch(err => next(err));
            } else {
                let err = new Error('Item not found');
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};