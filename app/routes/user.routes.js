const validation = require('../middlewares/validationMiddleware');
const userSchema = require('../validations/userValidation');
const loginSchema = require('../validations/loginValidation');

module.exports = (app) => {
    const users = require('../controller/users.controller');
    var router = require('express').Router();
    router.post('/login', validation.validLogin(loginSchema.loginSchema), users.userLogin);
    router.get('/logout', users.userLogout);
    router.post('/', validation.validUser(userSchema.createUserSchema), users.createUser);
    router.get('/', users.findRoleAllUsers);
    router.get('/:id', users.findoneUser);
    router.put('/:id', users.updateoneUser);
    router.delete('/', users.deleteRoleAllUser);
    router.delete('/:id', users.deleteoneUser);
    app.use('/user', router);
}
