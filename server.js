require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));


// Routes
app.use('/api/auth', require('./backend/routes/authRoutes'));
app.use('/api/consent', require('./backend/routes/consentRoutes'));
app.use('/api/connection', require('./backend/routes/connectionRoutes'));
app.use('/api/provider', require('./backend/routes/providerRoutes'));
app.use('/api/ledger', require('./backend/routes/ledgerRoutes'));
app.use('/api/compliance', require('./backend/routes/complianceRoutes'));
app.use('/api/request', require('./backend/routes/requestRoutes'));

app.get('/', (req, res) => res.send({ ok: true, message: 'MyDataHub backend running' }));

app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("Server runs on port https://localhost:5000")
        console.log('Served synched to database')
        console.log('Database and table created')
    }catch(err){
        console.error('Unable to connect')
    }
})
