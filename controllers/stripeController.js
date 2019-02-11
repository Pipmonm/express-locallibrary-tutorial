const keyPublishable = process.env.STRIPE_PUBLISHABLE_KEY;//2019-02-10 added for STRIPE integration
const keySecret = process.env.STRIPE_SECRET_KEY;//2019-02-10 added for STRIPE integration
const stripe = require("stripe")(keySecret);//2019-02-10 added for STRIPE integration

//2019-02-10  bare bones to start with
exports.stripeGet = (req, res) =>
  res.render("stripe_get.pug", {keyPublishable:keyPublishable});//2019-02-11 final version?

exports.stripePost = (req, res) => {
  let amount = 500;

  stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
         currency: "usd",
         customer: customer.id
    }))
  .then(charge => res.render("stripe_charge.pug"));
};
