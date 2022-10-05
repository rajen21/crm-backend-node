const yup = require('yup');

exports.createRoleSchema = yup.object().shape({
    role: yup.string().required(),
    active: yup.boolean().required(),
});