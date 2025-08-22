package com.rudrakshi.encryption.asymmetric;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.crypto.Cipher;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Base64;
import java.util.Scanner;


public class RsaEncryption {

    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);

        // Input for message
        System.out.println("Enter your Secret Message: ");
        String message = scanner.nextLine();

        // Generate Public and Private keys
        KeyPair keyPair = keyPairGenerator();
        PublicKey publicKey = keyPair.getPublic();
        PrivateKey privateKey = keyPair.getPrivate();

        // Encrypt Message using Public Key
        byte[] cipherText = encrypt(message, publicKey);
        String encoded = Base64.getEncoder().encodeToString(cipherText);
        System.out.println("Encrypted Message: " + new String(encoded));

        // Decrypt the message
        byte [] decoded = Base64.getDecoder().decode(encoded);
        String OriginalMessage = decrypt(decoded, privateKey);
        System.out.println("Decrypted Message: " + OriginalMessage);

    }


    // method to generate rsa key pair
    public static KeyPair keyPairGenerator() throws Exception {

        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(2048);
        return keyPairGenerator.generateKeyPair();
    }

    public static byte [] encrypt(String message , PublicKey publicKey) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE , publicKey);
        return cipher.doFinal(message.getBytes());
    }

    public static String decrypt(byte[] cipherText, PrivateKey privateKey) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE , privateKey);
        return new String(cipher.doFinal(cipherText));
    }
}
