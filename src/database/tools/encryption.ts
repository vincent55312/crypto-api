import * as dotenv from 'dotenv';
import * as CryptoJS from 'crypto-js';
dotenv.config()

export class Crypter {
  public static encrypt(value: string){
    let key = CryptoJS.enc.Utf8.parse(process.env['ENCRYPTION_KEY']);
    let ciphertext = CryptoJS.AES.encrypt(value, key, {iv: key}).toString();
    return ciphertext;
  }

  public static decrypt(value: string){
    let key = CryptoJS.enc.Utf8.parse(process.env['ENCRYPTION_KEY']);
    let decryptedData = CryptoJS.AES.decrypt(value, key, {
    iv: key
    });
    return decryptedData.toString( CryptoJS.enc.Utf8 );
  }
}