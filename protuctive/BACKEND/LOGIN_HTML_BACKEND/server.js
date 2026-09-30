// This is the ENTRY POINT -- the file you actually run to start the backend.
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());
const authRoutes = require('./routers/authRoutes');
// Any request starting with "/api/auth" gets handled by authRoutes.
app.use('/api/auth', authRoutes);
// A simple route just to confirm the server is alive if you visit it in a browser
app.get('/', (req, res) => {
    res.send('auth backend running');
});
// Which port to listen on -- uses .env value if set, otherwise defaults to 5001
const PORT =process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`auth backend running on port ${PORT}`);
});