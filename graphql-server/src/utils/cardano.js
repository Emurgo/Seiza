import bs58 from 'bs58'
import cbor from 'cbor'
import crc32 from 'crc-32'

export function isAddress(a) {
  try {
    const [tagged, checksum] = cbor.decode(bs58.decode(a))
    // eslint-disable-next-line no-bitwise
    const unsigned = (x) => x >>> 0

    return unsigned(crc32.buf(tagged.value)) === checksum
  } catch (e) {
    return false
  }
}
