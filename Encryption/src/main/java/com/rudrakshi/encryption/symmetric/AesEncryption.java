    package com.rudrakshi.encryption.symmetric;

    import javax.crypto.*;
    import java.io.UnsupportedEncodingException;
    import java.nio.charset.StandardCharsets;
    import java.security.InvalidKeyException;
    import java.security.NoSuchAlgorithmException;
    import java.util.Arrays;
    import java.util.Base64;
    import java.util.Scanner;

    public class AesEncryption {
        public static void main(String[] args) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException {

            Scanner scanner = new Scanner(System.in);

            System.out.println("Enter The message to Encrypt:");
            String message = scanner.nextLine();

            // Convert to byte array
            byte [] bytes = message.getBytes(StandardCharsets.UTF_8);

            // Generating AES KEY
            SecretKey secretKey = keyGenerator();

            // Encrypt the byte array
            byte [] cipherBlock = encrypt(bytes, secretKey);

            // Base64 Encoding of cipher
            String encoded = Base64.getEncoder().encodeToString(cipherBlock);
            System.out.println("Encrypted Message: " + encoded);

            // Decoding the
            byte [] decoded = Base64.getDecoder().decode(encoded);
            byte [] decipherBlock = decrypt(decoded, secretKey);
            System.out.println("Decrypted Message: " + new String(decipherBlock));

        }
        public static SecretKey keyGenerator() throws NoSuchAlgorithmException {
            KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
            keyGenerator.init(128);
            SecretKey secretKey = keyGenerator.generateKey();
            return secretKey;

        }

        public static byte[] encrypt(byte[] originalText , SecretKey secretKey) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            return cipher.doFinal(originalText);

        }

        public static byte[] decrypt(byte[] encryptedBlock , SecretKey secretKey) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            return cipher.doFinal(encryptedBlock);
        }
    }
