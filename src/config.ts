export const CONFIG = {
    // ⚠️ SECURITY: Use VITE_OPENAI_API_KEY environment variable.
    // In Vercel/Netlify, add 'VITE_OPENAI_API_KEY' to your Environment Variables.
    OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
    MODEL: 'gpt-4o-mini', // Faster and cheaper for simple reviews
};
