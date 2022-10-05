const express = require('express');
const cors = require('cors');
const db = require('./app/models');

const app = express();
var corsOptions = {
    origin: "http://localhost:3000"
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((data) => {
    console.log('connected to database');
}).catch((err) => {
    console.log(`can't connect to database!! ,${err}`);
    process.exit();
});

app.get('/', (req, res) => {
    res.json({ message: 'Wellcome' });
});

require('./app/routes/user.routes')(app);
require('./app/routes/role.routes')(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
