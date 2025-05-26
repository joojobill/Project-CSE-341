const { application } = require('express');
const mongobd = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req , res) => {
    const result = await mongobd.getDatabase().db().collection('users').find();
    result.toArray().then((users) => {
        res.setHeader('Conect-type', 'application/json');
        res.status(200).json(users);
    })

};

const getSingle = async (req , res) => {
    const userId = new ObjectId(req.params.id);
    const result = await mongobd.getDatabase().db().collection('users').find({_id: userId});
    result.toArray().then((users) => {
        res.setHeader('Conect-type', 'application/json');
        res.status(200).json(users[0]);
    })


};

const createUser = async (req, res) => {
    const userId = new ObjectId(req.params.id);
    const user = {
        firstName: req.body.firstName,
        lastname: req.body.lastname,
        Email: req.body.Email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    const response = await mongobd.getDatabase().db().collection('users').insertOne(user);
    if (response.acknowledge)  {
        res.status(200).send();
    } else {
        res.status(500).json(response.error || 'some error occured while updating the user');
    }
};

const updateUser = async (req, res) => {
    const userId = new ObjectId(req.params.id);
    const user = {
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        ipaddress: req.body.ipaddress
    };
     const response = await mongobd.getDatabase().db().collection('users').replaceOne({_id: userId}, user);
    if (response.modifiedCount > 0)  {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'some error occured while updating the user');
    };
    
};
const deleteUser = async (req, res) => {
    const userId = new ObjectId(req.params.id);

    const user = {
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        ipaddress: req.body.ipaddress
    };
     const response = await mongobd.getDatabase().db().collection('users').remove({_id: userId}, user);
    if (response.deleteCount > 0)  {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'some error occured while deleting the user');
    };

};

 
module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};