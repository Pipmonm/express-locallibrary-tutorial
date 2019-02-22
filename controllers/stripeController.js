//const keyPublishable = process.env.STRIPE_PUBLISHABLE_KEY;//2019-02-10 added for STRIPE integration
//const keySecret = process.env.STRIPE_SECRET_KEY;//2019-02-10 added for STRIPE integration
//const stripe = require("stripe")(keySecret);//2019-02-10 added for STRIPE integration
//let amount = STRIPE.stripeCharge.toString();//2019-02-13 must be a penny amount
//let fancyAmount = "$" + `(amount/100)`.toString();
//**************curiously STRIPE is not defined outside of exported functions
//               ie only find STRIPE when wherever imported????
//2019-02-10  bare bones to start with
exports.stripeGet = (req, res) => {
  let rawAmount = STRIPE.stripeCharge/100;//2019  need number for fancyAmount
  let amount = STRIPE.stripeCharge.toString();//2019-02-13 must be a penny amount
  STRIPE.denomination_US = "USD";//2019-02-18  TEMPORARY, move to general STRIPE declarations(?)
  let denomination = STRIPE.denomination_US;
  let fancyAmount = "$" + rawAmount.toFixed(2).toString();
  console.log("@@@ $$ keyPublishable reported as: " + fancyAmount);
  //const keyPublishable = process.env.STRIPE_PUBLISHABLE_KEY; //2019-02-12 try directly (async???)
  res.render("stripe_get.pug", {keyPublishable:'pk_test_5uHse6DFoVXDYSj8H3l1dYvY', amount:amount, denomination:denomination, labelAmount:fancyAmount});//STRIPE.stripeCharge.toString()});//2019-02-11 final version?
}

                                               //using variable seems to cause trouble
exports.stripePost = (req, res) => {
  let rawAmount = STRIPE.stripeCharge/100;//2019  need number for fancyAmount
  let amount = STRIPE.stripeCharge.toString();//2019-02-13 must be a penny amount
  let fancyAmount = "$" + rawAmount.toFixed(2).toString();
  //let amount = stripeCharge;//2019-02-11 was 500 pennies (number not string)
  console.log("@@@ $ am at stripePost & stripeCharge is: " + STRIPE.stripeCharge + "  or (fancier): " + fancyAmount);
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
    .catch(error => {
       console.log("@@@ EE 1st attempt to catch error: " + error);
       let tactfulMsg = "Stripe reporst: 'Unable to process credit card charge'";
       res.render("stripe_postError.pug",{errMsg:error, tactfulMsg:tactfulMsg});
       //2019-02-21  sees error but doesn't render and desn't exit
    })
  .then(charge => {
    let denomination = charge.currency.toUpperCase();
    console.log("@@@ $ trying for stripe_post.pug with charge: " + charge.amount);//2019-02-12 notion of using charge in render is mine
    res.render("stripe_post.pug",{charge:charge,denomination:denomination, fancyAmount:fancyAmount});//original only has filename and no variable declaration (no {})
  }).catch(error => {
     console.log("@@@ EE 2nd attempt to catch error: " + error);
     res.render("stripe_postError.pug",{errMsg:error});
  })//.done(() => console.log("@@@ $ done"));
};
