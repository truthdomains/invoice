export const priceFormatter = (/** @type {number} */ price) => {
    return price / 100;
};

export const dateFormatter = (datestring) => {
    const date = new Date(datestring);

    return date.toLocaleString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const dateInputFormatter = (datestring) => {
    const date = new Date(datestring);
    // getMonth is zero-indexed
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
