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
  let source =   '/';
  let source2 = "Home";
  const keyPublishable = process.env.STRIPE_PUBLISHABLE_KEY; //2019-02-12 try directly (async???)
  //console.log("@@@ $ publishable key: "  + keyPublishable + "  & typeof: " + typeof keyPublishable);
  //res.render("stripe_get.pug", {keyPublishable:'pk_test_5uHse6DFoVXDYSj8H3l1dYvY',
  res.render("stripe_get.pug", {keyPublishable:keyPublishable,
                                amount:amount,
                                denomination:denomination,
                                labelAmount:fancyAmount,
                                source:source,
                                source2:source2});//STRIPE.stripeCharge.toString()});//2019-02-11 final version?
}

                                               //using variable seems to cause trouble
exports.stripePost = (req, res) => {
  let rawAmount = STRIPE.stripeCharge/100;//2019  need number for fancyAmount
  let amount = STRIPE.stripeCharge.toString();//2019-02-13 must be a penny amount
  let fancyAmount = "$" + rawAmount.toFixed(2).toString();
  let registration_Data = "1424953867:1572461:CPU:FS1001";
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
         customer: customer.id,
         metadata: ('systemId': registration_Data)
    }))
    .catch(error => {
       console.log("@@@ EE 1st attempt to catch error: " + error);
       let source =   '/';
       let source2 = "HOME";
       let tactfulMsg = "Unable to process credit card charge";
       res.render("stripe_postError.pug",{errMsg:error,source:source,source2:source2, tactfulMsg:tactfulMsg});
       //2019-02-21  sees error but doesn't render and desn't exit
    })
  .then(charge => {
    let denomination = charge.currency.toUpperCase();
    let source =   '/';
    let source2 = "HOME";
    let systemId = charge.metadata.systemId;//2019-05-15
    console.log("@@@ $ trying for stripe_post.pug with charge: " + charge.amount);//2019-02-12 notion of using charge in render is mine
    res.render("stripe_post.pug",{source:source,source2:source2,charge:charge,denomination:denomination, fancyAmount:fancyAmount, systemId:systemId});//original only has filename and no variable declaration (no {})
  }).catch(error => {
     console.log("@@@ EE 2nd attempt to catch error: " + error);
     let source =   '/';
     let source2 = "HOME";
     let tactfulMsge = "";
     res.render("stripe_postError.pug",{errMsg:error,source:source,source2:source2, tactfulMsg:tactfulMsg});
  })//.done(() => console.log("@@@ $ done"));
};
