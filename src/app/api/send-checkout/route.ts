import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("Missing GOOGLE_SHEETS_WEBHOOK_URL environment variable.");
      return NextResponse.json(
        { error: "Webhook URL configuration missing" },
        { status: 500 }
      );
    }

    // Google Apps Script processes plain text JSON without CORS preflight/redirect issues
    const gasResponse = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(body),
      redirect: 'follow',
    });

    if (!gasResponse.ok) {
      const errorText = await gasResponse.text();
      throw new Error(`Google Apps Script returned HTTP ${gasResponse.status}: ${errorText}`);
    }

    const result = await gasResponse.json();

    if (result.status === "error") {
      throw new Error(result.message || "Google Sheets script execution error");
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Checkout submission failed:", errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
