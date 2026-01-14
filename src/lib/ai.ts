import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatGroq } from '@langchain/groq';

// Initialize Gemini model (Primary)
const getGeminiModel = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    if (!apiKey) {
        console.warn('❌ VITE_GOOGLE_API_KEY not found');
        return null;
    }

    console.log('🔑 Gemini API Key:', `Found (${apiKey.substring(0, 8)}...)`);
    return new ChatGoogleGenerativeAI({
        model: 'gemini-2.5-flash',
        apiKey,
        maxOutputTokens: 2048,
        temperature: 0.9,
    });
};

// Initialize Groq model (Fallback)
const getGroqModel = () => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
        console.warn('❌ VITE_GROQ_API_KEY not found');
        return null;
    }

    console.log('🔑 Groq API Key:', `Found (${apiKey.substring(0, 8)}...)`);
    return new ChatGroq({
        model: 'llama-3.3-70b-versatile', // Fast and powerful model
        apiKey,
        maxTokens: 2048,
        temperature: 0.9,
    });
};

// Mock roast for when all APIs fail
const MOCK_ROAST = `Beta, baith... baat karni hai. 

Maine dekha tera digital footprint and honestly, I'm not angry, I'm just disappointed. Which, as all Indian children know, is worse.

**GitHub Analysis:**
50 repositories? FIFTY? Beta, Sharma ji ka beta has 5 repos but 500 stars each. You have 50 repos with what? Combined stars less than your IQ? Quality over quantity seekha nahi? Hamare zamane mein, we wrote code that WORKED. Now you're making repos like you're collecting Pokemon cards.

**The Cross-Platform Contradiction:**
You're grinding LeetCode like your life depends on it (it does, beta), but your GitHub contribution graph looks like a cardiac arrest report – green, then flat, then panic commits at 3 AM. "Consistency" ka matlab jaante ho?

**The Real Burn:**
You know what's the saddest part? You'll still get a job. Some desperate startup will hire you because they can't afford Sharma ji's son. And that, beta, is your ceiling – being the budget option.

🔥 **Signature Line:** "Mere paas 50 repos hai, tumhare paas kya hai? Stars? Followers? Contributions? Kuch bhi nahi."

*Final Diagnosis:* Log kya kahenge? Nothing, because they haven't noticed you yet. And the way your GitHub is going, they never will.

Chal, ab jaake green squares bana. At least pretend you're working.`;

// Stream mock response
async function streamMockResponse(onChunk: (chunk: string) => void): Promise<string> {
    const words = MOCK_ROAST.split(' ');
    let fullText = '';

    for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 25));
        const chunk = (i === 0 ? '' : ' ') + words[i];
        fullText += chunk;
        onChunk(chunk);
    }

    return fullText;
}

// Generate roast with Gemini -> Groq fallback -> Mock fallback
export async function generateRoast(
    prompt: string,
    onChunk: (chunk: string) => void
): Promise<string> {
    const geminiModel = getGeminiModel();
    const groqModel = getGroqModel();

    // If no API keys at all, use mock
    if (!geminiModel && !groqModel) {
        console.warn('⚠️ No AI API keys found, using mock response');
        return streamMockResponse(onChunk);
    }

    // Try Gemini first
    if (geminiModel) {
        try {
            console.log('🚀 Attempting roast with Gemini...');
            const stream = await geminiModel.stream(prompt);
            let fullText = '';

            for await (const chunk of stream) {
                const content = chunk.content?.toString() || '';
                fullText += content;
                onChunk(content);
            }

            console.log('✅ Gemini roast completed successfully!');
            return fullText;
        } catch (error) {
            console.error('❌ Gemini failed:', error);
            console.log('🔄 Falling back to Groq...');
        }
    }

    // Try Groq as fallback
    if (groqModel) {
        try {
            console.log('🚀 Attempting roast with Groq...');
            const stream = await groqModel.stream(prompt);
            let fullText = '';

            for await (const chunk of stream) {
                const content = chunk.content?.toString() || '';
                fullText += content;
                onChunk(content);
            }

            console.log('✅ Groq roast completed successfully!');
            return fullText;
        } catch (error) {
            console.error('❌ Groq also failed:', error);
            console.log('🔄 Falling back to mock response...');
        }
    }

    // Final fallback to mock
    console.warn('⚠️ All AI APIs failed, using mock response');
    return streamMockResponse(onChunk);
}
