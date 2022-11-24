const RSA_ALGORITHM_NAME = 'RSA-OAEP';
const RSA_KEY_FORMAT = 'spki';
const JWT_KEY_FORMAT = 'pkcs8';

const { fromByteArray, toByteArray } = require('base64-js');

const { subtle } = require('node:crypto').webcrypto

const params = {
    name: RSA_ALGORITHM_NAME,
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: 'SHA-256',
};

const generateKey = async () => {
    const key =  await subtle
      .generateKey(params, true, ['encrypt', 'decrypt']);

      console.log(key);

      const exportedBytes = await subtle
      .exportKey(RSA_KEY_FORMAT, key.publicKey);

      console.log(exportedBytes);

      const base64PublicKey = fromByteArray(new Uint8Array(exportedBytes));
      console.log(base64PublicKey);
      console.log(base64PublicKey.length);

      const importedBytes = await subtle
      .exportKey(JWT_KEY_FORMAT, key.privateKey);

      console.log(importedBytes);

      const base64PrivateKey = fromByteArray(new Uint8Array(importedBytes));
      console.log(base64PrivateKey);
      console.log(base64PrivateKey.length);

}

generateKey();

  /**
   * Stores base64 encoded public key.
   */
//     const exportedBytes = await window
//       .crypto
//       .subtle
//       .exportKey(RSA_KEY_FORMAT, this.encryptionKeys.publicKey);

//       this.base64PublicKey = fromByteArray(new Uint8Array(exportedBytes));
//   }