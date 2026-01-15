import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { message, technologies } = await request.json();

        if (!process.env.ANTHROPIC_API_KEY) {
            console.error('ANTHROPIC_API_KEY is missing');
            return NextResponse.json(
                { error: 'Chat API is not configured. Please check ANTHROPIC_API_KEY environment variable.' },
                { status: 500 }
            );
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1024,
                messages: [{
                    role: 'user',
                    content: `You are an expert in agrifood technologies. Here is our database of technologies:

${JSON.stringify(technologies, null, 2)}

User question: ${message}

Provide a helpful, concise answer. If recommending technologies, explain why they're suitable. Keep responses under 200 words.`
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Anthropic API error:', data);
            return NextResponse.json(
                { error: data.error?.message || 'The AI service returned an error.' },
                { status: response.status }
            );
        }

        if (!data.content || !data.content[0] || !data.content[0].text) {
            console.error('Unexpected Anthropic API response structure:', data);
            return NextResponse.json(
                { error: 'Received an unexpected response from the AI service.' },
                { status: 500 }
            );
        }

        const aiMessage = data.content[0].text;
        return NextResponse.json({ message: aiMessage });
    } catch (error: any) {
        console.error('Chat error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get response' },
            { status: 500 }
        );
    }
}