import { Injectable } from '@angular/core';

import { fromByteArray, toByteArray } from 'base64-js';

const RSA_ALGORITHM_NAME = 'RSA-OAEP';
const RSA_PB_KEY_FORMAT = 'spki';
const RSA_PV_KEY_FORMAT = 'pkcs8';

@Injectable({
    providedIn: 'root'
})  
export class CryptoService {

    // private encryptionKeys!: CryptoKeyPair;
    // private base64PublicKey!: string;
    // private base64PrivateKey!: string;

    constructor() {
        // this.generateEncryptionKeys();
    }

    // getBase64PublicKey(): string {
    //     return this.base64PublicKey;
    // }

    // getBase64PrivateKey(): string {
    //     return this.base64PrivateKey;
    // }

    // getPublicKey(): CryptoKey {
    //     return this.encryptionKeys.publicKey;
    // }

    async decodeBase64PublicKey(base64Encoded: string): Promise<CryptoKey> {
        const params = {
            name: RSA_ALGORITHM_NAME,
            hash: 'SHA-256'
        };

        const bytes = toByteArray(base64Encoded);
        return window
            .crypto
            .subtle
            .importKey(RSA_PB_KEY_FORMAT, bytes, params, true, ['encrypt']
        );
    }

    async decodeBase64PrivateKey(base64Encoded: string): Promise<CryptoKey> {
        const params = {
            name: RSA_ALGORITHM_NAME,
            hash: 'SHA-256'
        };

        const bytes = toByteArray(base64Encoded);
        return window
            .crypto
            .subtle
            .importKey(RSA_PV_KEY_FORMAT, bytes, params, true, ['encrypt']
        );
    }

    /**
     * Encrypts the given text with the given public key.
     *
     * @param text the text to encrypt.
     * @param publicKey the key used to encrypt the text.
     * @returns The base64 encoded string representing the encrypted text.
     */
    async encrypt(text: string, publicKey: CryptoKey): Promise<string> {
        const data = new TextEncoder().encode(text);
        return window.crypto.subtle.encrypt(
            { name: RSA_ALGORITHM_NAME },
            publicKey,
            data
        ).then( (encrypted) => {
            const encoded = fromByteArray(new Uint8Array(encrypted));
            return encoded;
        });
    }

    /**
     * Decrypt the base64 encoded string with my private key.
     * @param base64Encoded the base64 string to decrypt.
     * @returns the decrypted text.
     */
    async decrypt(base64Encoded: string, privateKeyBase64: string): Promise<string> {
        const params = {
            name: RSA_ALGORITHM_NAME
        };

        const privateKey = await this.decodeBase64PrivateKey(privateKeyBase64);

        const bytes = toByteArray(base64Encoded);
        return window.crypto.subtle.decrypt(params, privateKey, bytes)
            .then( (decrypted) => {
            const text = new TextDecoder('utf-8').decode(decrypted);
            return text;
            });
    }

    private async generateEncryptionKeys(): Promise<string[]>{
        const params = {
            name: RSA_ALGORITHM_NAME,
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: 'SHA-256',
        };

        const encryptionKeys = await window
            .crypto
            .subtle
            .generateKey(params, true, ['encrypt', 'decrypt']);
        return await this.onEncryptionKeysGenerated(encryptionKeys);
    }

    /**
     * Stores base64 encoded public key.
     */
    private async onEncryptionKeysGenerated(encryptionKeys: CryptoKeyPair): Promise<string[]> {
        const exportedPublicBytes = await window
            .crypto
            .subtle
            .exportKey(RSA_PB_KEY_FORMAT, encryptionKeys.publicKey);

        const exportedPrivateBytes = await window
            .crypto
            .subtle
            .exportKey(RSA_PV_KEY_FORMAT, encryptionKeys.privateKey);

        const base64PublicKey = fromByteArray(new Uint8Array(exportedPublicBytes));
        const base64PrivateKey = fromByteArray(new Uint8Array(exportedPrivateBytes));

        return [base64PublicKey, base64PrivateKey]
    }

    public async sha256(message: string) {
        // encode as UTF-8
        const msgBuffer = new TextEncoder().encode(message);

        // hash the message
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

        // convert ArrayBuffer to Array
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // convert bytes to hex string
        const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
        return hashHex;
    }

}