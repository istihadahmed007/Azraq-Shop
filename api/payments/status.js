import { getPaymentlyConfig } from '../../server/paymentlyService.js';
import { getAllTransactions, getAllOrders } from '../../server/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const config = getPaymentlyConfig();
  const txns = await getAllTransactions();
  const orders = await getAllOrders();

  return res.status(200).json({
    success: true,
    gateway: {
      gateway_name: 'Paymently',
      merchant_name: config.merchantName,
      domain: 'azraq.paymently.io',
      base_url: config.baseUrl,
      currency: config.currency,
      has_api_key: Boolean(config.apiKey && config.apiKey.length > 5),
      has_database: Boolean(process.env.DATABASE_URL),
      total_real_transactions: txns.length,
      total_real_orders: orders.length,
      supported_methods: ['bKash', 'Nagad', 'Rocket', 'Upay', 'Visa', 'Mastercard', 'Bangla QR', 'Bank Transfer', 'Cash on Delivery'],
      brand_palette: {
        primary: '#0877C9',
        dark: '#062B4F',
        accent: '#50DDF0',
        light: '#F8FCFF'
      }
    }
  });
}
