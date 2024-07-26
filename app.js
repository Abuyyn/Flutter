const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const sequelize = require('./models/index');
require("dotenv").config()

// Models
const User = require('./models/User');
const Pembeli = require('./models/pembeli');
const Hewan = require('./models/Hewan');
const Penjualan = require('./models/penjualan');
const DataPenjualan = require('./models/datapenjualan');
const Pesanan = require('./models/pesanan');
const Penjual = require('./models/penjual');

const app = express();

// Associations
User.hasOne(Pembeli, { foreignKey: 'userID' });
User.hasOne(Penjual, { foreignKey: 'userID' });
Pembeli.belongsTo(User, { foreignKey: 'userID' });


Penjual.belongsTo(User, { foreignKey: 'userID' });

Penjual.hasMany(Penjualan, { foreignKey: 'penjualID' });
Penjualan.belongsTo(Penjual, { foreignKey: 'penjualID' });

Hewan.hasMany(Penjualan, { foreignKey: 'hewanID' });
Penjualan.belongsTo(Hewan, { foreignKey: 'hewanID' });

Hewan.hasMany(DataPenjualan, { foreignKey: 'hewanID' });
DataPenjualan.belongsTo(Hewan, { foreignKey: 'hewanID' });

Pesanan.belongsTo(Hewan, { foreignKey: 'hewanID' });
Pesanan.belongsTo(Pembeli, { foreignKey: 'pembeliID' });
Pesanan.belongsTo(Penjual, { foreignKey: 'penjualID' }); 
Pesanan.hasMany(DataPenjualan, { foreignKey: 'pesananID' });

DataPenjualan.belongsTo(Pesanan, { foreignKey: 'pesananID' });
// Routes
const authRouter = require('./routes/auth');
const pembeliRouter = require('./routes/pembeli');
const hewanRouter = require('./routes/hewan');
const penjualanRouter = require('./routes/penjualan');
const dataPenjualanRouter = require('./routes/datapenjualan');
const pesananRouter = require('./routes/pesanan');

app.get('/', (req, res, next) => {
  res.send('Selamat datang di Aplikasi Qurban Sejahtera')
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/pembeli', pembeliRouter);
app.use('/hewan', hewanRouter);
app.use('/penjualan', penjualanRouter);
app.use('/datapenjualan', dataPenjualanRouter);
app.use('/pesanan', pesananRouter);

sequelize.sync()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

sequelize.authenticate()
    .then(() => console.log('Database connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));



app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.sendStatus(404);
});

module.exports = app;
