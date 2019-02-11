//const keyPublishable = process.env.STRIPE_PUBLISHABLE_KEY;//2019-02-10 added for STRIPE integration
//const keySecret = process.env.STRIPE_SECRET_KEY;//2019-02-10 added for STRIPE integration
//const stripe = require("stripe")(keySecret);//2019-02-10 added for STRIPE integration

//2019-02-10  bare bones to start with
exports.stripeGet = (req, res) =>
  res.render("stripe_get.pug", {keyPublishable:'pk_test_5uHse6DFoVXDYSj8H3l1dYvY'});//2019-02-11 final version?
                                              //using variable seems to cause trouble
exports.stripePost = (req, res) => {
  let amount = stripeCharge;//2019-02-11 was 500 pennies (number not string)
  console.log("@@@ $ am at stripePost & stripeCharge is: " + stripeCharge.toString());
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
  .then(charge => {
    console.log("@@@ $ trying for stripe_post.pug with charge: " + charge);
    res.render("stripe_post.pug",{charge:charge});
  });
};
