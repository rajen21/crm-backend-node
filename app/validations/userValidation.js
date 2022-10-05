const yup = require('yup');

exports.createUserSchema = yup.object().shape({
    // body: yup.object({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(5).max(100).required(),
    adminID: yup.string(),
    agentID: yup.string(),
    roleID: yup.string().required(),
    age: yup.number().required(),
    active: yup.boolean().required(),
    // })
});
