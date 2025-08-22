package com.rudrakshi.encryption;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;

import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.security.*;
import java.util.Base64;
import java.util.Scanner;

//@SpringBootApplication
public class HybridCryptography {
    public HybridCryptography() throws NoSuchPaddingException, NoSuchAlgorithmException {
    }

    public static void main(String[] args) throws Exception {
        // Generate RSA Key Pair
        KeyPair keyPair = generateRsaKeyPair();
        PrivateKey privateKey = keyPair.getPrivate();
        PublicKey publicKey = keyPair.getPublic();
        System.out.println("RSA Public Key: " + Base64.getEncoder().encodeToString(publicKey.getEncoded()));
        System.out.println("RSA Private Key: " + Base64.getEncoder().encodeToString(privateKey.getEncoded()));

        // Generate AES Key
        SecretKey secretKey = aesKeyGenerator();
        System.out.println("AES Secret Key: " + Base64.getEncoder().encodeToString(secretKey.getEncoded()));
        byte [] secretKeyBytes = secretKey.getEncoded();

        // Scanner
        Scanner scanner = new Scanner(System.in);

        // Input Message from User
        System.out.println("Enter a Message to Encrypt");
        String message = scanner.nextLine();
        byte [] messageBytes = message.getBytes();

        // Encrypt Message using AES Key
        byte [] cipherText = encryptDataUsingAES(secretKey, messageBytes);

        // Display the Encrypted message
        String EncodedCipherText = Base64.getEncoder().encodeToString(cipherText);
        System.out.println("Encrypted Message: " + new String(EncodedCipherText));

        // Encrypt AES Key using RSA Public Key
        byte [] encryptedAESKey = encryptAESKeyUsingRSA(secretKeyBytes , publicKey);
        String encodedAESKey = Base64.getEncoder().encodeToString(encryptedAESKey);
        System.out.println("Encrypted AES Key: " + new String(encodedAESKey));


        // --- Sending the Encrypted AES Key through the server ----

        // Decrypte the AES Key using RSA Private Key
        SecretKey decryptedAESKey = decryptAESKeyUsingRSA(encryptedAESKey, privateKey);
        byte [] SecretKeyBytes = decryptedAESKey.getEncoded();
        System.out.println("Decrypted AES Key: " + Base64.getEncoder().encodeToString(SecretKeyBytes));

        // Decode the Message using AES Key
        byte [] decryptedMessage = decrypteDataUsingAES(decryptedAESKey, cipherText);
        System.out.println("Decrypted Message: " + new String(decryptedMessage));



    }


    public static SecretKey aesKeyGenerator() throws NoSuchAlgorithmException {
        KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
        keyGenerator.init(128);
        return keyGenerator.generateKey();
    }

    public static KeyPair generateRsaKeyPair() throws NoSuchAlgorithmException {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(1024);
       return keyPairGenerator.generateKeyPair();
    }

    public static byte [] encryptDataUsingAES(SecretKey secretKey , byte [] messageInBytes) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE , secretKey );
        return cipher.doFinal(messageInBytes);
    }

    public static byte[] decrypteDataUsingAES(SecretKey decryptedAESKey , byte [] messageInBytes ) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE , decryptedAESKey);
        return cipher.doFinal(messageInBytes);
    }

    public static byte[] encryptAESKeyUsingRSA(byte[] secretKeyBytes , PublicKey publicKey)throws Exception{
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE , publicKey);
        return cipher.doFinal(secretKeyBytes);
    }

    public static SecretKey decryptAESKeyUsingRSA(byte[] encryptedAESKey , PrivateKey privateKey)throws Exception{
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE , privateKey);
        byte [] decryptedAESKey = cipher.doFinal(encryptedAESKey);
        return new SecretKeySpec(decryptedAESKey, "AES");
    }

}

