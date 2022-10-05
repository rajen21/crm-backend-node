module.exports = (mongoose) => {
    var schema = mongoose.Schema(
        {
            role: {
                type: String,
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
    const Role = mongoose.model('roles', schema);
    return Role;
};

