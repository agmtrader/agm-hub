import { NextRequest, NextResponse } from 'next/server';

type ClientLogBody = {
  source?: string;
  event?: string;
  severity?: 'INFO' | 'WARNING' | 'ERROR';
  timestamp?: string;
  payload?: unknown;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ClientLogBody;

    const logEntry = {
      source: typeof body?.source === 'string' ? body.source : 'unknown_client_source',
      event: typeof body?.event === 'string' ? body.event : 'unknown_event',
      severity:
        body?.severity === 'INFO' || body?.severity === 'WARNING' || body?.severity === 'ERROR'
          ? body.severity
          : 'ERROR',
      timestamp: typeof body?.timestamp === 'string' ? body.timestamp : new Date().toISOString(),
      payload: body?.payload ?? null,
    };

    // JSON line logging so Cloud Run can ingest a structured record.
    const serializedLog = JSON.stringify(logEntry);
    if (logEntry.severity === 'INFO') {
      console.info(serializedLog);
    } else if (logEntry.severity === 'WARNING') {
      console.warn(serializedLog);
    } else {
      console.error(serializedLog);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        source: 'client-log-route',
        event: 'invalid_client_log_payload',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
