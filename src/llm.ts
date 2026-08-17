import OpenAI from 'openai';
import { config } from './config';
import { DesktopAction, LLMResponse } from './types';

const client = new OpenAI({
  apiKey: config.openai.apiKey,
});

export async function analyzeScreenshot(
  screenshotBase64: string,
  userTask: string,
  previousActions: DesktopAction[] = []
): Promise<LLMResponse> {
  const systemPrompt = `You are a computer use agent that interacts with a Linux desktop using mouse and keyboard.
Your goal is to complete the user's task by taking appropriate actions on the desktop.

When responding, you MUST return valid JSON with the following structure:
{
  "action": {
    "type": "click|type|keypress|scroll|drag|wait|complete",
    "x": number (optional, for click/drag),
    "y": number (optional, for click/drag),
    "text": string (optional, for type),
    "key": string (optional, for keypress - e.g., "Enter", "Tab", "Control+C"),
    "direction": "up|down" (optional, for scroll),
    "amount": number (optional, for scroll - number of ticks),
    "startX": number (optional, for drag),
    "startY": number (optional, for drag),
    "endX": number (optional, for drag),
    "endY": number (optional, for drag)
  },
  "reasoning": string,
  "confidence": number (0.0-1.0)
}

For "complete" action type, the task has been successfully finished.
For "wait" action type, briefly pause before the next action (useful after clicking buttons that need time to respond).

Always analyze the current state of the desktop and provide logical next steps.`;

  const userPrompt = `Task: ${userTask}\n\nPrevious actions taken: ${previousActions.length > 0 ? JSON.stringify(previousActions.slice(-5), null, 2) : 'None yet'}\n\nLook at the current desktop screenshot and determine the next action to take.`;

  try {
    const response = await client.messages.create({
      model: config.openai.model,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/png',
                data: screenshotBase64,
              },
            },
            {
              type: 'text',
              text: userPrompt,
            },
          ],
        },
      ],
      system: systemPrompt,
    });

    // Extract the text response
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from LLM');
    }

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from LLM response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as LLMResponse;
    return parsed;
  } catch (error) {
    console.error('Error analyzing screenshot with LLM:', error);
    // Return a default wait action on error
    return {
      action: {
        type: 'wait',
        amount: 1,
      },
      reasoning: 'Error occurred during analysis, waiting before retry',
      confidence: 0.0,
    };
  }
}
