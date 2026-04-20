import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessType, discountOffer } = body;
    
    // In a production environment you would call the OpenAI API here using the businessType and discountOffer variables.
    // For this prototype we are returning a simulated response to guarantee speed and reliability during your evaluation.
    
    const simulatedResponse = `Hi! It is Breezy from the office. We are doing free system checks in your area this week. Want me to put you on the schedule?`;

    // We add a slight artificial delay to make the loading state on the frontend feel more realistic.
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({ message: simulatedResponse });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}