const cron = require('node-cron');
const Driver = require('../models/Driver');
const client = require('../config/twilio');

const checkLicenseExpirations = async () => {
    console.log('Cron job executed');
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Set to midnight to ensure date comparison

        const warningDate = new Date(today);
        warningDate.setDate(today.getDate() + 7);

        // Query drivers whose license expiration date is between today and the next 7 days
        const expiringDrivers = await Driver.find({ 
            licenseExpDate: { 
                $lte: warningDate,
                $gte: today 
            } 
        });
        
        console.log('Expiring Drivers:', expiringDrivers);

        expiringDrivers.forEach(driver => {
            client.messages.create({
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                to: `whatsapp:+${driver.mobileNo}`,
                body: `Dear *${driver.name}*,\nyour driver's license will expire on\n\n*${driver.licenseExpDate.toDateString()}*.\n\nPlease renew it as soon as possible to avoid any inconvenience.`
            }).then(message => console.log(`Message sent to ${driver.name}: ${message.sid}`))
              .catch(err => console.error('Error sending message:', err));
        });
    } catch (err) {
        console.error('Error checking license expirations:', err);
    }
}

 

cron.schedule('*/20 * * * * *', checkLicenseExpirations, {
   timezone: "Asia/Colombo",
});


/*cron.schedule('0 0 * * * ', checkLicenseExpirations, {
    timezone: "Asia/Colombo",
});*/

