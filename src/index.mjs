import './styles.css';

import { dateFormatter, priceFormatter } from './helpers.mjs';

const config = {
  company: {
    name: 'TRUTH DOMAINS',
    // logo: new URL('./logo.png', import.meta.url), // option to include logo
  },
  payment_details: {
    bank_name: 'World Credit',
    bank_code: 'XWW678',
    account_number: '0000001',
  },
};

const invoices = [
  {
    number: 654,
    status: 'paid',
    date_created: '2023/11/26',
    items: [
      {
        description: 'domainname.com.au',
        quantity: 1,
        price: 2315,
      },
      {
        description: 'anothername.co.nz',
        quantity: 1,
        price: 2750,
      },
    ],
  },
];

let showing_invoice_pos = invoices.length - 1;

// Company Name || Company Logo
if (config.company.logo) {
  document.getElementById('company_name').parentNode.innerHTML = `<img src="${config.company.logo}" />`;
} else {
  document.getElementById('company_name').value = String(config.company.name);
}

// Payment Details
let payment_details = '';

for (let [key, value] of Object.entries(config.payment_details)) {
  payment_details += `<dt><input value="${key.replace('_', ' ')}"></dt><dd><input value="${value}"></dd>`;
}

document.getElementById('payment_details').innerHTML = payment_details;

// Invoice Number
document.getElementById('invoice_number').innerHTML = String(invoices[0].number);

// Invoice Date
document.getElementById('date').innerHTML = dateFormatter(invoices[0].date_created);

// Invoice Items
let invoice_items = '',
  invoice_total = 0;

for (let value of Object.values(invoices[showing_invoice_pos].items)) {
  invoice_total += value.price;

  invoice_items += `
  <tr>
    <td><input value="${value.description}"></td>
    <td><input type="number" value=${value.quantity}></td>
    <td><input type="number" value=${priceFormatter(value.price)}></td>
  </tr>`;
}

document.getElementById('invoice_items').innerHTML = invoice_items;

// Invoice Total
document.getElementById('invoice_total').innerHTML = priceFormatter(invoice_total);
