import './styles.css';

import { dateFormatter, dateInputFormatter, priceFormatter } from './helpers.mjs';

const config = {
  company: {
    name: 'TRUTH DOMAINS',
    // logo: new URL('./logo.png', import.meta.url), // option to include logo
  },
  currency: {
    code: 'AUD',
    symbol: '$',
  },
  payment_details: {
    bank_name: 'WORLD CREDIT',
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

let isShiftPressed = false;

document.getElementById('payment_details').addEventListener('keydown', (e) => {
  isShiftPressed = e.shiftKey;
});

// Add a new object to the end of the items array, when tabbing out of the last input
document.getElementById('payment_details').addEventListener('focusout', (e) => {
  const $dl = e.currentTarget;
  // if the target is an input and it's the last input in the list
  if (e.target.tagName === 'INPUT' && e.target === $dl.lastElementChild.lastElementChild) {
    const $dt = document.createElement('dt'),
      $dd = document.createElement('dd'),
      $dti = document.createElement('input'),
      $ddi = document.createElement('input');

    $dt.appendChild($dti);
    $dd.appendChild($ddi);

    $dl.appendChild($dt);
    $dl.appendChild($dd);

    if (!isShiftPressed)
      $dti.focus();

    // remove the pair if both inputs are empty
    $ddi.addEventListener('focusout', (f) => {
      if (f.target.value === '' && f.target.parentNode.previousElementSibling.firstElementChild.value === '') {
        f.target.parentNode.previousElementSibling.remove(); // dt
        f.target.parentNode.remove(); // dd
      }
    });

    // attache event also to the second field
    $dti.addEventListener('focusout', () => {
      $ddi.dispatchEvent(new Event('focusout'));
    });
  }
});

document.getElementById('payment_details').innerHTML = payment_details;

// Invoice Number
document.getElementById('invoice_number').value = String(invoices[0].number);

// Invoice Date
const $date = document.getElementById('date');

$date.addEventListener('mouseover', (e) => {
  const stringValue = e.target.value;
  $date.value = dateInputFormatter(stringValue);
  $date.type = 'date';
});
$date.addEventListener('mouseout', (e) => {
  $date.type = 'text';
  $date.value = dateFormatter(e.target.value);
  $date.blur();
});

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
document.getElementById('invoice_total').innerHTML = `${config.currency.symbol}${priceFormatter(invoice_total)}`;
