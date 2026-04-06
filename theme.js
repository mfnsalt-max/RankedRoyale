 const root = document.documentElement;
  const savedColors = JSON.parse(localStorage.getItem('siteColors'));
  if(savedColors){
    root.style.setProperty('--accent', savedColors.accent);
    root.style.setProperty('--bg', savedColors.bg);
    root.style.setProperty('--surface', savedColors.surface);
    root.style.setProperty('--text', savedColors.text);
  }
  
  // Initialize Supabase (Ensure these credentials match your app)
const supabaseUrl = 'https://bxhxfsfpzbluevvimvyy.supabase.co';
const supabaseKey = 'sb_publishable_POfMVVd3io00nMXGlRc2eQ_jndDE2oj';
const globalSupabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function checkGlobalNotifications() {
    const { data: { user } } = await globalSupabase.auth.getUser();
    if (!user) return;

    // Check for pending friend requests
    const { data, error } = await globalSupabase
        .from('friendships')
        .select('id')
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

    const dot = document.getElementById('friend-notification');
    if (dot) {
        if (data && data.length > 0) {
            dot.style.display = 'block';
        } else {
            dot.style.display = 'none';
        }
    }
}

// Run on page load
window.addEventListener('load', () => {
    checkGlobalNotifications();
    // Optional: Check every 60 seconds for new requests
    setInterval(checkGlobalNotifications, 10000);
});