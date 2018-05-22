/* eslint-disable */
const formatAsCurrency = require('./currency');

describe('utils currency', () => {
  it('hundred value', () => {
    const value = 5000;
    console.log(typeof formatAsCurrency(value))
    expect(formatAsCurrency(value)).toBe('CLP 5,000');
  })
});

/* eslint-disable */