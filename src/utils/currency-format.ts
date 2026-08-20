export const currencyFormat = (num: number, toFixed: number = 2) => {
    return '$' + num.toFixed(toFixed).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

export const amountFormat = (num: number) => {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

export const currencyCompactFormat = (num: number): string => {
    const abs = Math.abs(num);
    const sign = num < 0 ? '-' : '';

    if (abs >= 1_000_000_000) {
        return `${sign}$${+(abs / 1_000_000_000).toPrecision(3)}B COP`;
    }
    if (abs >= 1_000_000) {
        return `${sign}$${+(abs / 1_000_000).toPrecision(3)}M COP`;
    }
    if (abs >= 1_000) {
        return `${sign}$${+(abs / 1_000).toPrecision(3)}K COP`;
    }
    return `${sign}$${abs} COP`;
}