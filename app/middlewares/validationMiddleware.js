exports.validUser = (schema) => async (req, res, next) => {
    try {
        const { body } = req;
        await schema.validate(body, { abortEarly: false })
        next();
    } catch(err) {
        return res.json(err);
    }
};

exports.validRole = (schema) => async (req, res, next) => {
    try {
        const { body } = req;
        await schema.validate(body, { abortEarly: false })
        next();
    } catch(err) {
        return res.json(err);
    }
};

exports.validLogin = (schema) => async (req, res ,next) => {
    try {
        const { body } = req;
        await schema.validate(body, { abortEarly: false })
        next();
    } catch(err) {
        return res.json(err);
    }
}
