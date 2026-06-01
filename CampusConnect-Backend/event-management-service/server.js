const express = require('express');
const eventRoutes = require('./routes/EventRoutes');
const sequelize = require('./utils/db');
const { connectProducer } = require('./config/kafka'); 
const app = express();
const PORT = 3001; // Use a different port than USS (3000)

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.use('/events', eventRoutes);

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Event DB connected and models synced.');
        return connectProducer(); 
    })

    .then(() => {
        app.listen(PORT, () => {
            console.log(`Event Management Service running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Service failed to start:', err);
        process.exit(1);
    });