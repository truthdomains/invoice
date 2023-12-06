export const priceFormatter = (price) => {
    price /= 100;
    return price.toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD'
    });
};

export const dateFormatter = (datestring) => {
    const date = new Date(datestring);

    return date.toLocaleString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
