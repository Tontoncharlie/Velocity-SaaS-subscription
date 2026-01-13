import { createClient } from '@supabase/supabase-js'

let supabaseInstance = null

function getSupabase() {
    if (supabaseInstance) {
        return supabaseInstance
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        // Return a mock client during build time to prevent errors
        return {
            auth: {
                getSession: async () => ({ data: { session: null }, error: null }),
                getUser: async () => ({ data: { user: null }, error: null }),
                signInWithPassword: async () => ({ data: null, error: { message: 'Not initialized' } }),
                signUp: async () => ({ data: null, error: { message: 'Not initialized' } }),
                signOut: async () => ({ error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                resetPasswordForEmail: async () => ({ error: null }),
                updateUser: async () => ({ data: null, error: null }),
            },
            from: () => ({
                select: () => ({ data: [], error: null }),
                insert: () => ({ data: null, error: null }),
                update: () => ({ eq: () => ({ data: null, error: null }) }),
                delete: () => ({ eq: () => ({ data: null, error: null }) }),
                upsert: () => ({ data: null, error: null }),
            }),
        }
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    return supabaseInstance
}

// Export a proxy that lazily initializes the client
export const supabase = new Proxy({}, {
    get(target, prop) {
        const client = getSupabase()
        const value = client[prop]
        if (typeof value === 'function') {
            return value.bind(client)
        }
        return value
    }
})
