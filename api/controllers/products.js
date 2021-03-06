const mongoose = require('mongoose');

const Product = require('../models/product');




exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            console.log("All Products from DB: ", docs);
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            URL: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            if (docs.length >= 0) {
                res.status(200).json(response);
            }
            else {
                res.status(404).json({
                    message: "No entries found!"
                });
            }

        })
        .catch(err => {
            console.log("Error when fetching all products from DB: ", err);
            res.status(500).json({
                error: err
            });
        });
}

exports.products_create = (req, res, next) => {
    console.log("Product Image: ", req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        console.log("Product saved in database: ", result);
        res.status(201).json({
            message: 'Created product successfully!',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    URL: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
        .catch(err => {
            console.log("Product POST Error: ", err);
            res.status(500).json({
                error: err
            });
        });
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log("Product Find result from database: ", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'GET_ALL_PRODUCTS',
                        URL: 'http:/localhost:3000/products'
                    }
                });
            }
            else {
                res.status(404).json({ message: "Product doesn't exist with this id!" });
            }

        })
        .catch(err => {
            console.log("Error in Product Find: ", err);
            res.status(500).json({ error: err });
        });
}

exports.products_update = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log("Patch request to DB result: ", result);
            res.status(200).json({
                message: 'Product updated successfully!',
                request: {
                    type: 'GET',
                    URL: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log("Error when PATCH to DB: ", err);
            res.status(500).json({
                error: err
            });
        });
}

exports.products_delete = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted successfully!',
                request: {
                    type: 'POST',
                    URL: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch(err => {
            console.log("Error when deleting from DB: ".err);
            res.status(500).json({
                error: err
            });
        });
}