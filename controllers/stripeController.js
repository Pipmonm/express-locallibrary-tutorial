//2019-02-10  bare bones to start with
exports.stripeGet = function(req, res) =>
  res.render("stripe_get.pug", {keyPublishable}));

exports.stripePost = function(req, res) => {
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
});
