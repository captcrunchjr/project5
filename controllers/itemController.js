const { MongoBulkWriteError } = require('mongodb');
var Item = require('../models/item');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

/* GET items listing. */
exports.index = function(req, res, next) {
    Item.find()
        .sort({price: 1})
        .then(items => {
            res.render('./items/', {items: items})
        })
        .catch(err => next(err));
};

exports.search = function(req, res, next) {
    Item.find()
        .sort({price: 1})
        .then(items => {
            res.render('items', { error: "You must provide a search term", items: items });
        })
        .catch(err => next(err));
}

exports.searchTerm = function(req, res, next) {
    let searchTerm = decodeURIComponent(req.params.term).trim();
    if(searchTerm.length < 3){
        Item.find()
        .sort({price: 1})
        .then(items => {
            res.render('items', { error: "Search term must be at least 3 characters", items: items });
        })
        .catch(err => next(err));
        return;
    }
    Item.find({
        $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { details: { $regex: searchTerm, $options: 'i' } },
            //{ seller: { $regex: searchTerm, $options: 'i' } },
            //{ condition: { $regex: searchTerm, $options: 'i' } },
            //{ price: { $regex: searchTerm, $options: 'i' } } Don't want to set it up to handle searching text vs numbers
        ]
    })
    .sort({price: 1})
    .then(items => {
        if(items.length == 0){
            res.render('items', { error: "No items found", items: [] });
        }
        else{
            res.render('items', { error: null, items: items });
        }
    })
    .catch(err => next(err));
}

exports.new = function(req, res, next) {
    res.render('items/new');
}

exports.create = (req, res, next) => {
    upload.single('image')(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            console.log("Multer error: " + err);
            err.status = 400;
            next(err);
        } else if (err) {
            console.log("Error " + err);
            return next(err);
        } else {
            console.log(req.file, "File processed by multer");
            if (!req.file) {
                let err = new Error('No file uploaded');
                err.status = 400;
                return next(err);
            }
            let item = new Item({
                title: req.body.title,
                condition: req.body.condition,
                price: req.body.price,
                seller: req.session.user,
                details: req.body.details,
                image: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                }
            });
            item.save()
                .then((item) => res.redirect('/items'))
                .catch(err => {
                    if(err.name === 'ValidationError'){
                        err.status = 400;
                    }
                    next(err);
                });
        }
    });
};

exports.view = function(req, res, next) {
    let id = req.params.id;
    Item.findById(id).populate('seller', 'firstName lastName')
        .then(item => {
            if(item && item.seller){
                let sellerId = item.seller._id.toString();
                console.log(req.session.user);
                console.log(sellerId);
                res.render('items/view', {item, sellerId});
            } else {
                let err = new Error('Item with id ' + id + ' not found');
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
}

exports.delete = function(req, res, next) {
    const itemId = req.params.id;
    Item.deleteOne({ _id: itemId })
        .then(result => {
            if(result){
                Offer.deleteMany({ item: itemId })
                    .then(() => res.redirect('/items'))
                    .catch(err => next(err));
            } else {
                let err = new Error('Item not deleted');
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

exports.edit = function(req, res, next) {
    Item.findById(req.params.id)
        .then(item => {
            if(item != null){
                res.render('items/edit', { item: item });
            } else {
                let err = new Error('Item not found');
                err.status = 500;
                throw err;
            }
        })
        .catch(err => next(err));
}

exports.update = function(req, res, next) {
    upload.single('image')(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            console.log("Multer error: " + err);
            err.status = 400;
            next(err);
        } else if (err) {
            console.log("Error " + err);
            return next(err);
        } else {
            const updatedItem = {
                title: req.body.title,
                condition: req.body.condition,
                price: req.body.price,
                details: req.body.details,
            };

            if (req.file) { // Check if a file was uploaded
                updatedItem.image = {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                };
            }

            // Move the update operation inside the callback function
            Item.findByIdAndUpdate({_id: req.params.id}, updatedItem, {new: true})
                .then(result => {
                    if(result){
                        res.redirect('/items/view/' + req.params.id);
                    } else {
                        let err = new Error('Item not updated');
                        err.status = 404;
                        next(err);
                    }
                })
                .catch(err => next(err));
        }
    });
}