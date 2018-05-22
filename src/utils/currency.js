function formatAsCurrency(number) {
  const currencyFormatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'CLP',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0,
    // the default value for minimumFractionDigits depends on the currency
    // and is usually already 2
  });
  return currencyFormatter.format(number);
}

module.exports = formatAsCurrency;
