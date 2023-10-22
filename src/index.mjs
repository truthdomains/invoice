import './styles.css';

let invoice_number = 653;

document.getElementById('invoice_number').innerHTML = invoice_number;

let invoice_total = 60;

document.getElementById('invoice_total').innerHTML = `$${invoice_total}.00`;

const payment_details_obj = {
  'key': 'value',
  'key': 'value',
  'key': 'value',
};

let payment_details = '';

for (let [key, value] of Object.entries(payment_details_obj)) {
  payment_details += `<dt>${key}</dt><dd>${value}</dd>`;
}

document.getElementById('payment_details').innerHTML = payment_details;

document.getElementById('invoice_items').innerHTML = `
  <tr>
  <td>Sample Item</td>
  <td>1</td>
  <td>$60</td>
  </tr>
  <tr>
  <td>Sample Item</td>
  <td>1</td>
  <td>$60</td>
  </tr>
`;
