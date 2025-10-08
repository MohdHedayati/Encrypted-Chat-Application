// src/api/messageApi.js

const API_BASE_URL = 'https://localhost:8443/api';

/**
 * Fetches conversation history between current user and another user
 * @param {string} otherUsername - The username of the other person
 * @returns {Promise<Array>} Array of message objects
 */
export const fetchConversationHistory = async (otherUsername) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/messages/conversation/${otherUsername}`,
            {
                method: 'GET',
                credentials: 'include', //  Sends session cookie for authentication
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const messages = await response.json();
        return messages;
    } catch (error) {
        console.error('Error fetching conversation history:', error);
        throw error;
    }
};