let invoice_number = 654;

document.getElementById('invoice_number').innerHTML = String(invoice_number);

let invoice_total = 60;

document.getElementById('invoice_total').innerHTML = `$${invoice_total}.00`;

const payment_details_obj = {
  'Bank Name': 'World Credit',
  'Bank Code': 'XWW678',
  'Account Number': '0000001',
};

let payment_details = '';

for (let [key, value] of Object.entries(payment_details_obj)) {
  payment_details += `<dt>${key}</dt><dd>${value}</dd>`;
}

document.getElementById('payment_details').innerHTML = payment_details;

document.getElementById('invoice_items').innerHTML = `
  <tr>
  <td>Sample Item One</td>
  <td>1</td>
  <td>$30</td>
  </tr>
  <tr>
  <td>Sample Item Two</td>
  <td>4</td>
  <td>$30</td>
  </tr>
`;

/* Status */
const $input_status = document.getElementById('status');
const $effect_status = document.getElementById('effect_status');

$input_status.addEventListener('change', (event) => {
  $effect_status.removeAttribute('class'); // reset animation
  $effect_status.innerText = event.target.value;
  $effect_status.offsetWidth; // see https://css-tricks.com/restart-css-animation/#aa-update-another-javascript-method-to-restart-a-css-animation
  $effect_status.className = event.target.value;
});
