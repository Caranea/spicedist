const express = require("express");
const stripe = require('stripe')('sk_test_51KW7FpA9vwNhyZdJsJc1OmkS49VkGvTI9qMzlWgtZdv6sU62l3uQTNIHOaWOORj1decAmHF0DUxmXa1ZmGO7yWZf00C6sUiqpd')
const router = express.Router();
const userSchema = require("../models/User");

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'T-shirt',
        },
        unit_amount: 2000,
        recurring: {
          interval: "month",
          interval_count: 1,
        },
      },
      quantity: 1,
    }, ],
    mode: 'subscription',
    success_url: 'http://46.101.153.180:4200/success',
    cancel_url: 'http://46.101.153.180:4200/success',
  });

  res.json({
    url: session.url
  });
});

router.get('/subscription/:email', async (req, res) => {
  const errors = []
  const customer = await stripe.customers.list({
    email: req.params.email
  });
  if (customer && customer.data.length > 0) {
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.data[0].id,
    });
    if (subscriptions.data[0] && subscriptions.data[0].id) {
      let user = await userSchema.findOne({
        email: req.params.email
      });
      if (!user) {
        errors.push({
          msg: 'Email not found'
        })
      } else {
        user.subscriptionId = subscriptions.data[0].id;
        console.log(user)
        await user.save();
        res.status(200).json({
          subscriptionId: subscriptions.data[0].id
        })
      }

    } else {
      errors.push({
        msg: 'Subscription not found'
      })
    }
  } else {
    errors.push({
      msg: 'Customer not found'
    })
  }
  if (errors.length > 0) {
    res.status(404).json(errors)
  }
})

router.delete('/delete/:id', async (req, res) => {
  console.log('a')
  console.log(req.params.id)
  const deleted = await stripe.subscriptions.del(req.params.id);
  const user = await userSchema.findOne({subscriptionId: req.params.id})
  console.log(user)
  user.subscriptionId= null
  console.log(user)
  await user.save();
  console.log('www')
  res.status(200).json({msg: 'subscription deleted'})
})

module.exports = router;
