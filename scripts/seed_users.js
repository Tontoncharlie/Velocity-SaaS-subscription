const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Extract keys from .env.local logic (simplified)
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const getEnv = (key) => {
    const match = envContent.match(new RegExp(`${key}=(.*)`));
    return match ? match[1].trim() : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const TEST_USERS = [
    { email: 'user1_free@velocity.test', password: 'password123', plan: 'Free Tier', full_name: 'Test User Free' },
    { email: 'user2_pro@velocity.test', password: 'password123', plan: 'Pro Plan', full_name: 'Test User Pro' },
    { email: 'user3_ent@velocity.test', password: 'password123', plan: 'Enterprise', full_name: 'Test User Enterprise' },
    { email: 'user4_free_new@velocity.test', password: 'password123', plan: 'Free Tier', full_name: 'Test User New' },
    { email: 'user5_pro_exp@velocity.test', password: 'password123', plan: 'Pro Plan', full_name: 'Test User Pro Expiring' }
];

async function seedUsers() {
    console.log('Starting seed process...');
    const results = [];

    for (const user of TEST_USERS) {
        console.log(`Processing ${user.email}...`);

        // 1. Create Auth User (auto-confirmed)
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true,
            user_metadata: { full_name: user.full_name, phone: '1234567890' }
        });

        if (authError) {
            console.error(`Error creating auth user ${user.email}:`, authError.message);
            // If user exists, we might want to fetch their ID to update profile anyway
            // But for now, we'll skip or you can handle "User already registered"
            if (authError.message.includes('registered')) {
                // Try to sign in to get ID? Or list users?
                // admin.listUsers is pagination based. 
                console.log('Skipping creation (exists).');
                continue; // For simplicity in this one-off
            }
            continue;
        }

        const userId = authData.user.id;
        console.log(`Created Auth User: ${userId}`);

        // 2. Upsert Profile
        const updates = {
            id: userId,
            email: user.email,
            full_name: user.full_name,
            plan: user.plan,
            status: 'Active',
            phone: '1234567890'
        };

        const { error: profileError } = await supabase
            .from('profiles')
            .upsert(updates);

        if (profileError) {
            console.error(`Error updating profile for ${user.email}:`, profileError.message);
        } else {
            console.log(`Profile updated: ${user.plan}`);
            results.push({ email: user.email, password: user.password, plan: user.plan });
        }
    }

    console.log('\n--- Seed Complete ---');
    console.log('Created Users:');
    console.table(results);
}

seedUsers();
