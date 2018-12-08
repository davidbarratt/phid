const generate = require('./index');

test( 'generates a phid', () => {
  const result = generate('TEST', 'SUBS');

  return result.then((phid) => {
    expect(phid).toHaveLength(30);
    expect(phid).toEqual(expect.stringContaining('PHID-TEST-SUBS-'));
  })
});

test( 'generates a phid with no sub', () => {
  const result = generate('TEST');

  return result.then((phid) => {
    expect(phid).toHaveLength(30);
    expect(phid).toEqual(expect.stringContaining('PHID-TEST-'));
  })
});
