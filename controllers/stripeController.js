//2019-02-10  bare bones to start with
exports.stripeGet = (req, res) =>
  res.render("stripe_get.pug", {keyPublishable:'pk_test_5uHse6DFoVXDYSj8H3l1dYvY'});

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
