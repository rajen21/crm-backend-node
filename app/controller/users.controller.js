const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const db = require('../models');
const Admin = db.admin;
const Agent = db.agent;
const User = db.user;
const Role = db.role;

exports.createUser = async (req, res) => {
    const [validRole] = await Role.find({ _id: { $in: req.body.roleID } });
    if (!validRole) {
        res.status(400).send({ message: 'Please enter valid roleID' });
        return;
    }
    if (validRole.active === false) {
        res.status(400).send({ message: 'This role is currently not active, please try after some time' });
        return;
    }
    if (validRole.role === 'Agent' && !req.body.adminID.length) {
        res.status(400).send({ message: 'Please enter adminID' });
        return;
    }
    if (validRole.role === 'User' && !req.body.adminID.length && !req.body.agentID) {
        res.status(400).send({ message: 'Please enter adminID and agentID' });
        return;
    }

    const tempUser = {};
    const newPassword = await bcrypt.hash(req.body.password, 10);

    const validAdmin = await User.find({ _id: { $in: req.body.adminID } });
    const validAdminId = validAdmin.map((elem) => elem.id);
    const inactiveAdmins = validAdmin.find((elem) => !elem.active);

    if (inactiveAdmins) {
        res.status(400).send({ message: 'You are currently inactive, please activate your account then try again' });
        return;
    }
    if (!validAdminId.length) {
        res.status(400).send({ message: 'Please enter valid adminID' });
        return;
    }

    if (validRole.role === 'Agent') {
        tempUser.adminID = validAdminId;
    }

    if (validRole.role === 'User') {
        const [validAgent] = await User.find({ _id: { $in: req.body.agentID } });

        if (!validAgent.id) {
            res.status(400).send({ message: 'Please enter valid agentID' });
            return;
        }
        if (!validAgent.active) {
            res.status(400).send({ message: 'You are currently inactive, please activate your account then try again' });
            return;
        }
        tempUser.adminID = validAdminId;
        tempUser.agentID = validAgent.id;
    }
    tempUser.first_name = req.body.first_name;
    tempUser.last_name = req.body.last_name;
    tempUser.email = req.body.email
    tempUser.password = newPassword;
    tempUser.role = validRole.role;
    tempUser.age = req.body.age;
    tempUser.active = req.body.active;

    const user = new User(tempUser);

    user.save()
        .then((data) => {
            res.send({ status: true, user: data });
        }).catch((err) => {
            res.status(500).send({ status: false, message: err.message || 'some error occured' });
        })
};

exports.findRoleAllUsers = (req, res) => {

    User.find(req.query).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({ message: err.message || 'error occured' })
    })
}

exports.findoneUser = (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message || 'error finding user with id ' + id })
        })
}

exports.updateoneUser = async (req, res) => {
    if (!req.body) {
        req.status(400).send({ message: 'data to update cant be empty' });
    }
    const tempBody = {};

    if (req.body.editid) {
        const { editid, password, first_name, last_name, email, age } = req.body;

        tempBody.first_name = first_name;
        tempBody.last_name = last_name;
        tempBody.email = email;
        tempBody.age = age;
    } else if (req.body.changeActive) {
        tempBody.active = req.body.active;
    } else if (req.body.passwordChange) {
        const user = await User.findOne({
            id: req.body.userID
        });

        if (!user) {
            res.status(400).send({ message: 'Please enter valid agentID' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(req.body.oldPassword, user.password);

        if (isPasswordValid) {
            const newPassword = await bcrypt.hash(req.body.newPassword, 10);
            tempBody.password = newPassword;
        } else {
            res.status(400).send({ status: false, message: 'Please enter right old password' });
            return;
        }
    }
    const id = req.params.id;
    User.findByIdAndUpdate(id, tempBody, { useFindAndModify: false })
        .then((data) => {
            res.send({ status: true, message: 'user is updated successfully' });
        }).catch((err) => {
            res.status(500).send({ status: false, message: err.message || 'Error updating user with id ' + id });
        });
};

exports.deleteoneUser = (req, res) => {
    const id = req.params.id;
    User.findByIdAndRemove(id)
        .then((data) => {
            res.send({ status: true, message: 'User was deleted successfully' });
        })
        .catch((err) => {
            res.status(500).send({ status: false, message: err.message || 'error while deleting user' });
        });
}

exports.deleteRoleAllUser = (req, res) => {
    User.deleteMany(req.query)
        .then((data) => {
            res.send({
                status: true,
                message: `${data.deletedCount} Users were deleted!!`
            });
        })
        .catch((err) => {
            res.status(500).send({
                status: false,
                message: err.message || "some error occured while deleting User"
            });
        });
};

exports.userLogin = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    })

    if (!user) {
        res.status(400).send({ message: 'Email is wrong' });
        return;
    };
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (isPasswordValid) {
        const tempToken = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            age: user.age,
            active: user.active
        };

        if (user.role === 'Agent') {
            tempToken.adminID = user.adminID;
        }
        if (user.role === 'User') {
            tempToken.adminID = user.adminID
            tempToken.agentID = user.agentID
        }

        const token = jwt.sign(tempToken, 'secret123');
        return res.json({ status: true, user: token });
        // return res.json({ status: 'ok', user: token })
    } else {
        res.status(400).send({ status: false, user: false, message: 'Password is wrong' });
        return;
    }
}


exports.userLogout = async (req, res) => {
    try {
        jwt.sign('', 'secret123');
        res.send({ status: true, user: '' });
        return;
    } catch (err) {
        res.status(400).send({ status: false, user: false, message: err.message });
        return;
    }
}

