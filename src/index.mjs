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

const showing_invoice_pos = invoices.length - 1;

// Company Name || Company Logo
if (config.company.logo) {
  document.getElementById('company_name').parentNode.innerHTML = `<img src="${config.company.logo}" alt="${config.company.name}" />`;
} else {
  document.getElementById('company_name').value = String(config.company.name);
}

let isShiftPressed = false;

// When tabbing in reverse from the trigger/last input, we don't want the focus going to the new item
document.addEventListener('keydown', (e) => {
  isShiftPressed = e.shiftKey;
});

// Payment Details
let payment_details = '';
const $payment_details = document.getElementById('payment_details');

for (const [key, value] of Object.entries(config.payment_details)) {
  payment_details += `<dt><input value="${key.replace('_', ' ')}"></dt><dd><input value="${value}"></dd>`;
}

$payment_details.innerHTML = payment_details;

// Add a new object to the end of the items array, when tabbing out of the last input
$payment_details.addEventListener('focusout', (e) => {
  const $dl = e.currentTarget;
  // if the target is an input and it's the last input in the list
  if (e.target.tagName === 'INPUT' && e.target === $dl.lastElementChild.lastElementChild && !isShiftPressed) {
    const $dt = document.createElement('dt');
    const $dd = document.createElement('dd');
    const $dti = document.createElement('input');
    const $ddi = document.createElement('input');

    $dt.appendChild($dti);
    $dd.appendChild($ddi);

    $dl.appendChild($dt);
    $dl.appendChild($dd);

    $dti.focus();

    // remove the pair if both inputs are empty
    $ddi.addEventListener('focusout', () => {
      if ($dti.value === '' && $ddi.value === '') {
        $dt.remove();
        $dd.remove();
      }
    });

    // attach event also to the second field
    $dti.addEventListener('focusout', () => {
      $ddi.dispatchEvent(new Event('focusout'));
    });
  }
});

// Invoice Number
document.getElementById('invoice_number').value = String(invoices[showing_invoice_pos].number);

// Invoice Date
const $date = document.getElementById('date');

$date.addEventListener('mouseover', () => {
  const stringValue = $date.value;
  $date.value = dateInputFormatter(stringValue);
  $date.type = 'date';
});
$date.addEventListener('mouseout', () => {
  $date.type = 'text';
  $date.value = dateFormatter($date.value);
  $date.blur();
});

// Invoice Date
$date.value = dateFormatter(invoices[showing_invoice_pos].date_created);

// Invoice Items
let invoice_items = '';
let invoice_total = 0;
const $invoice_items = document.getElementById('invoice_items');

for (const value of Object.values(invoices[showing_invoice_pos].items)) {
  invoice_total += value.price;

  invoice_items += `
  <tr>
    <td><input value="${value.description}"></td>
    <td><input type="number" value=${value.quantity}></td>
    <td><input type="number" value=${priceFormatter(value.price)}></td>
  </tr>`;
}

$invoice_items.innerHTML = invoice_items;

// Add a new object to the end of the items array, when tabbing out of the last input
$invoice_items.addEventListener('focusout', (e) => {
  const $tbody = e.currentTarget;

  if (e.target.tagName === 'INPUT' && e.target === $tbody.lastElementChild.lastElementChild.lastElementChild && !isShiftPressed) {
    const $tr = document.createElement('tr');
    const $td1 = document.createElement('td');
    const $td2 = document.createElement('td');
    const $td3 = document.createElement('td');
    const $td1i = document.createElement('input');
    const $td2i = document.createElement('input');
    const $td3i = document.createElement('input');

    $td1.appendChild($td1i);
    $td2.appendChild($td2i);
    $td3.appendChild($td3i);

    $tr.appendChild($td1);
    $tr.appendChild($td2);
    $tr.appendChild($td3);

    $tbody.appendChild($tr);

    $td1i.focus();

    // remove the row if all inputs are empty
    $td1i.addEventListener('focusout', () => {
      if ($td3i.value === '' && $td2i.value === '' && $td3i.value === '') {
        $tr.remove();
      }
    });

    // attach event also to the second field
    $td2i.addEventListener('focusout', () => {
      $td1i.dispatchEvent(new Event('focusout'));
    });

    // attach event also to the third field
    $td3i.addEventListener('focusout', () => {
      $td1i.dispatchEvent(new Event('focusout'));
    });
  }
});

// Invoice Total
document.getElementById('invoice_total').innerHTML = `${config.currency.symbol}${priceFormatter(invoice_total)}`;
