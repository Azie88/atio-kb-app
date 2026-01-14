import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { message, technologies } = await request.json();

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY!,
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