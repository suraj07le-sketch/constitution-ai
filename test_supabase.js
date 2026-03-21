
const { createClient } = require("@supabase/supabase-js");

async function test() {
    const url = "https://zrjsbjmmzuxfmnpnacsc.supabase.co";
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyanNiam1tenV4Zm1ucG5hY3NjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjEyODI5MywiZXhwIjoyMDg3NzA0MjkzfQ.1QU3dP2ZoVARhRY_5pYyXX4BXclk1H-Z7orTtITuaEY";
    
    console.log("Testing Supabase connectivity...");
    const supabase = createClient(url, key);

    try {
        const { data, error, count } = await supabase
            .from("constitution_chunks")
            .select("*", { count: "exact", head: true });

        if (error) throw error;
        console.log("Success! Total chunks in DB:", count);
    } catch (e) {
        console.error("Failed:", e.message);
    }
}

test();
