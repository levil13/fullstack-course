if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: process.env.MONGO_URI,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true},
        jwt: process.env.JWT
    }
} else {
    module.exports = require('./keys.dev');
}
