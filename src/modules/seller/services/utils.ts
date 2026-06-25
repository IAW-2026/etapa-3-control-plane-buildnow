
export const BASE_URL = process.env.NEXT_PUBLIC_API_SELLER_URL ?? '';

export function buildHeaders(token: string): HeadersInit {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
}

export async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`API error ${res.status}: ${text}`);
    }
    return res.json() as Promise<T>;
}