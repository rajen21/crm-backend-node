const db = require('../models');
const Role = db.role;
const jwt = require('jsonwebtoken');

exports.createRole = async (req, res) => {
    const role = new Role({
        role: req.body.role,
        active: req.body.active
    });

    role.save()
    .then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({ message: err.message || 'some error occured while creating role' });
    })
};

exports.findallRole = (req, res) => {
    Role.find().then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({ message: err.message || 'error occured while getting Roles' })
    })
}

exports.findoneRole = (req, res) => {
    const id = req.params.id;
    Role.findById(id)
    .then((data) => {
        if(!data) res.status(404).send({ message: `Role with id ${id} is not exist` });
        else res.send(data);
    })
    .catch((err) => {
        res.status(500).send({ message: err.message || 'error finding Role with id ' + id })
    })
}

exports.updateoneRole = (req, res) => {
    if(!req.body) {
        req.status(400).send({ message: 'data to update cant be empty' });
    }

    const id = req.params.id;
    Role.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
        if(!data) {
            res.status(404).send({ message: `can't update role with id ${id}` });
        } else {
            res.send({ message: 'role is updated successfully' });
        }
    }).catch((err) => {
        res.status(500).send({ message: err.message || 'Error updating role with id ' + id });
    });
};

exports.deleteoneRole = (req, res) => {
    const id = req.params.id;
    Role.findByIdAndRemove(id)
    .then((data) => {
        if(!data) res.status(404).send({ message: `can't delete role with id ${id}` });
        else res.send({ message: 'Role was deleted successfully' });
    })
    .catch((err) => {
        res.status(500).send({ message: err.message || 'error while deleting role' });
    });
}


exports.deleteallRole = (req, res) => {
    Role.deleteMany({})
    .then((data) => {
        res.send({
            message: `${data.deletedCount} Roles were deleted!!`
        });
    })
    .catch((err) => {
        res.status(500).send({
            message: err.message || "some error occured while deleting role"
        });
    });
};
