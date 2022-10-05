const validation = require('../middlewares/validationMiddleware');
const roleSchema = require('../validations/roleValidation');

module.exports = (app) => {
    const roles = require('../controller/role.controller');
    var router = require('express').Router();
    router.post('/', validation.validRole(roleSchema.createRoleSchema), roles.createRole);
    router.get('/', roles.findallRole);
    router.get('/:id', roles.findoneRole);
    router.put('/:id', roles.updateoneRole);
    router.delete('/:id', roles.deleteoneRole);
    router.delete('/', roles.deleteallRole);
    app.use('/role', router);
}
