/* eslint-disable */
const formatAsCurrency = require('./currency');

describe('utils currency', () => {
  it('value', () => {
    expect(encodeURI(formatAsCurrency(500))).toBe("CLP%C2%A0500"); 
    expect(encodeURI(formatAsCurrency(5000))).toBe("CLP%C2%A05,000"); 
    expect(encodeURI(formatAsCurrency(5000000))).toBe("CLP%C2%A05,000,000"); 
  });
  it('strings', () => {
    expect(encodeURI(formatAsCurrency("500"))).toBe("CLP%C2%A0500"); 
  });
  it("0 on undefined", () => {
    expect(encodeURI(formatAsCurrency(undefined))).toBe("CLP%C2%A00");
  })
});

/* eslint-disable */