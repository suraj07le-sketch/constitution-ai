const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zrjsbjmmzuxfmnpnacsc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyanNiam1tenV4Zm1ucG5hY3NjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjEyODI5MywiZXhwIjoyMDg3NzA0MjkzfQ.1QU3dP2ZoVARhRY_5pYyXX4BXclk1H-Z7orTtITuaEY';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function run() {
    const email = 'sonkarsuraj447@gmail.com';
    const password = 'Gj27an0057@@';

    console.log('Checking if user exists...');

    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError.message);
        return;
    }

    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        console.log('User exists. Updating password...');
        const { data, error } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: password, email_confirm: true }
        );
        if (error) console.error('Error updating user:', error.message);
        else console.log('Successfully updated user password.');
    } else {
        console.log('User does not exist. Creating user...');
        const { data, error } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: { full_name: 'Suraj Sonkar' }
        });
        if (error) console.error('Error creating user:', error.message);
        else console.log('Successfully created user.');
    }
}

run();
