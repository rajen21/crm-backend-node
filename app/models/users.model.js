module.exports = (mongoose) => {
    const uniqueValidator = require('mongoose-unique-validator');
    var schema = mongoose.Schema(
        {
            first_name: {
                type: String,
                required: true,
            },
            last_name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
                unique : true,
            },
            password: {
                type: String,
                required: true,
            },
            adminID: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users',
                }
            ],
            agentID: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users',
            },
            role: {
                type: String,
                required: true,
            },
            age: {
                type: Number,
                required: true,
            },
            active: {
                type: Boolean,
                required: true,
            }
        }
    );
    schema.method('toJSON', function () {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });
    schema.plugin(uniqueValidator);
    const User = mongoose.model('users', schema);
    return User;
};

