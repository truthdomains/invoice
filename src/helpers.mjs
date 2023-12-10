export const priceFormatter = (/** @type {number} */ price) => {
    price /= 100;
    return price;
};

export const dateFormatter = (datestring) => {
    const date = new Date(datestring);

    return date.toLocaleString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
