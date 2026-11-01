export type JsonBodyResult =
  | { value: unknown; error?: never }
  | { value?: never; error: 'too_large' | 'invalid_json' }

export async function readJsonBody(request: Request, maxBytes: number): Promise<JsonBodyResult> {
  try {
    const text = await request.text()
    if (new TextEncoder().encode(text).byteLength > maxBytes) return { error: 'too_large' }
    return { value: JSON.parse(text) as unknown }
  } catch {
    return { error: 'invalid_json' }
  }
}
