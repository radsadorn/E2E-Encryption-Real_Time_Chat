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

const decodeBase64PublicKey = async (base64Encoded) => {
  const params = {
      name: RSA_ALGORITHM_NAME,
      hash: 'SHA-256'
  };

  const bytes = toByteArray(base64Encoded);
  return await subtle.importKey(RSA_KEY_FORMAT, bytes, params, true, ['encrypt']
  );
}

const decodeBase64PrivateKey = async (base64Encoded) => {
  const params = {
      name: RSA_ALGORITHM_NAME,
      hash: 'SHA-256'
  };

  const bytes = toByteArray(base64Encoded);
  return await subtle.importKey(JWT_KEY_FORMAT, bytes, params, true, ['decrypt']
  );
}

const encrypt = async (text, publicKey) => {
  const data = new TextEncoder().encode(text);
  return await subtle.encrypt(
      { name: RSA_ALGORITHM_NAME },
      publicKey,
      data
  ).then( (encrypted) => {
      const encoded = fromByteArray(new Uint8Array(encrypted));
      return encoded;
  });
}

const decrypt = async (base64Encoded, privateKey) => {
  const params = {
      name: RSA_ALGORITHM_NAME
  };

  // const privateKey = await this.decodeBase64PrivateKey(privateKeyBase64);

  const bytes = toByteArray(base64Encoded);
  return await subtle.decrypt(params, privateKey, bytes)
      .then( (decrypted) => {
        console.log(decrypted);
      const text = new TextDecoder('utf-8').decode(decrypted);
      return text;
      });
}

const message = 'Hello world';

const generateKey = async () => {
    const key =  await subtle
      .generateKey(params, true, ['encrypt', 'decrypt']);

      console.log(message);
      const encryptMessage = await encrypt(message, key.publicKey);
      console.log(encryptMessage);
      const decryptMessage = await decrypt( , key.privateKey);
      console.log(decryptMessage);

      console.log('KEY')
      console.log(key);

      const exportedBytes = await subtle
      .exportKey(RSA_KEY_FORMAT, key.publicKey);

      console.log('PBK');
      console.log(exportedBytes);

      const base64PublicKey = fromByteArray(new Uint8Array(exportedBytes));
      console.log(base64PublicKey);
      console.log(base64PublicKey.length);

      const publicKey = await decodeBase64PublicKey(base64PublicKey);
      console.log(publicKey);

      const importedBytes = await subtle
      .exportKey(JWT_KEY_FORMAT, key.privateKey);

      console.log('PVK');
      console.log(importedBytes);

      const base64PrivateKey = fromByteArray(new Uint8Array(importedBytes));
      console.log(base64PrivateKey);
      console.log(base64PrivateKey.length);

      const privateKey = await decodeBase64PrivateKey(base64PrivateKey);
      console.log(privateKey);

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