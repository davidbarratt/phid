const crypto = require('crypto');
const { promisify } = require('util');

const randomBytes = promisify(crypto.randomBytes);

/**
 * Read random alphanumeric characters from /dev/urandom or equivalent. This
 * method operates like @{method:readRandomBytes} but produces alphanumeric
 * output (a-z, 0-9) so it's appropriate for use in URIs and other contexts
 * where it needs to be human readable.
 *
 * @param   {int}     Number of characters to read.
 * @return  string  Random character string of the provided length.
 */
const readRandomCharacters = async (number) => {
  // NOTE: To produce the character string, we generate a random byte string
  // of the same length, select the high 5 bits from each byte, and
  // map that to 32 alphanumeric characters. This could be improved (we
  // could improve entropy per character with base-62, and some entropy
  // sources might be less entropic if we discard the low bits) but for
  // reasonable cases where we have a good entropy source and are just
  // generating some kind of human-readable secret this should be more than
  // sufficient and is vastly simpler than trying to do bit fiddling.
  const map = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    2,
    3,
    4,
    5,
    6,
    7
  ];

  let result = '';
  const buffer = await randomBytes(number);
  const bytes = buffer.toString('binary');

  for (let i = 0; i < number; i++) {
    result += map[bytes.charCodeAt(i) >> 3];
  }

  return result;
};

const generate = async (type, subtype) => {
  if (!type) {
    throw new Error('Can not generate PHID with no type.');
  }

  let uniqLen = 20;
  let typeStr = type;

  if (subtype) {
    uniqLen = 15;
    typeStr = `${type}-${subtype}`;
  }

  const uniq = await readRandomCharacters(uniqLen);
  return `PHID-${typeStr}-${uniq}`;
}

module.exports = generate;
