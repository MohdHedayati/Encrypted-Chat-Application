## INTRODUCTION 

- AES is a **symmetric cipher**, meaning it uses a **single, shared secret key** for both encryption and decryption. This makes it extremely fast and efficient, which is crucial for encrypting large amounts of data, like the stream of messages in a chat application.
## ENCRYPTION 

The Advanced Encryption Standard (AES) is a **symmetric block cipher** that transforms data using repeated cycles, or rounds.

1. **Block and Key Structure:** AES encrypts data in fixed **128-bit blocks** (represented as a 4×4 state matrix) using a secret **Cipher Key** that can be **128, 192, or 256 bits** long. The key length determines the number of rounds (Nr​) applied.
	We will be using AES-256, with Mode GCM as it provides with Authentication tag, so if message is tampered we would know, and key size is 256 for improved security.
    
2. **Rounds of Transformation:** After an initial **AddRoundKey** operation, the core encryption process repeats Nr​ times (e.g., 10, 12, or 14 rounds). Each of the first Nr​−1 rounds consists of four byte-oriented transformations:
    
    - **SubBytes():** Non-linear byte substitution using a lookup table (S-box).
        
    - **ShiftRows():** Cyclical shifting of the rows of the state matrix.
        
    - **MixColumns():** A matrix multiplication that mixes bytes within each column.
        
    - **AddRoundKey():** XORing the state matrix with a unique **Round Key** (derived from the main Cipher Key).
        
3. **Final Round Difference:** The very last round (the Nr​-th round) is slightly different, as the **MixColumns()** transformation is omitted to maintain the mathematical symmetry necessary for successful decryption.
## DECRYPTION

The AES decryption process is the **exact inverse** of the encryption process, using the same **secret key** but applying the transformations in reverse order.

1. **Inverse Rounds:** Decryption also repeats the process Nr​ times (matching the key length). The difference is that the order of the transformations is reversed, and the **inverse** of each transformation is used (e.g., InvShiftRows(), InvSubBytes()).
    
2. **Inverse Transformations:** In most of the rounds, the transformations are applied in this order:
    
    - **InvShiftRows():** Cyclical _right_ shifting of the rows.
        
    - **InvSubBytes():** Non-linear byte substitution using the _inverse_ substitution table (InvS-box).
        
    - **InvMixColumns():** The matrix multiplication is performed using the _inverse_ matrix.
        
    - **AddRoundKey():** The state is **XORed** with the Round Key, which is an operation that serves as its own inverse.
        
3. **Key Scheduling:** The Round Keys (derived from the main Cipher Key) are used in the **reverse order** compared to encryption. The key for the last encryption round is the first one used in decryption, and so on.
    
4. **Final Decryption Step:** Just as the final encryption round omitted MixColumns(), the final decryption round omits InvMixColumns() to complete the successful reversal of the process, yielding the original **128-bit plaintext** block.
## IV (Initialised Vector)

- An IV is a random or pseudo-random value that is used alongside the encryption key when encrypting data.The IV ensures that even if the same plaintext is encrypted multiple times with the same key, the ciphertexts will be different, thus preventing pattern leakage.A new, random IV is generated for each message encrypted with AES




