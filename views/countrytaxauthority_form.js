extends layout

block content
  h1=title

  form(method='POST' action='')
    div.form-group
      label(for='country_code') Country_postalcode
      input#country_code.form-control(type='text', placeholder='CA (required) ', name='country_code', required=true, value="CA")
    div.form_group
      label(for='allowed') Allowed
      input#allowed.form-control(type='boolean', placeholder='true/false', name='allowed', required=true, value=false)
    div.form-group
      label(for='rate') tax_rate
      input#rate.form-control(type='number', placeholder='0.05 (not 5%)', name='rate', required=false, value= 0.05)
    div.form-group
      label(for='restriction_code') Restriction Code (0:none, 1:#, 2:$, 3:both)
      input#restriction_code.form-control(type='number', placeholder='Restriction Code (required)', name='restriction_code', required=true, value=3 )
    div.form-group
      label(for='transaction_limit') Number of Transactions Limit
      input#transaction_limit.form-control(type='number', placeholder= 'transaction # threshold', name='transaction_limit', required=false, value= 100)
    div.form-group
      label(for='amount_limit') Dollar Amount Limit
      input#amount_limit.form-control(type='number', placeholder= 'total amount threshold', name='amount_limit', required=false, value= 30000)
    div.form-group
       label(for='transaction_period') Current Period Expiry Date
       input#transaction_period.form-control(type='date', placeholder='current period expiry date',name='transaction_period', required = false, value=2019-12-31)

    button.btn.btn-primary(type='submit') #{query===undefined ? "Submit" : query}
  if errors
    ul
      for error in errors
        li!= error.msg

  if error
    ul
      li
        error
