// Debug endpoint to check environment variables
// Remove this file after debugging is complete

export async function GET() {
    return Response.json({
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasPaystackKey: !!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
        // Show first 20 chars of URL to verify it's correct (safe to expose)
        supabaseUrlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    })
}
