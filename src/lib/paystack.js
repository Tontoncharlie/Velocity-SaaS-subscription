const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

export default paystack;
