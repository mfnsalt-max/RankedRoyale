import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { playerTag, apiToken } = await req.json()
    const encodedTag = encodeURIComponent(playerTag);
    const CR_DEV_KEY = Deno.env.get('CR_DEV_KEY');

    const crResponse = await fetch(`https://proxy.royaleapi.dev/v1/players/${encodedTag}/verifytoken`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CR_DEV_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: apiToken })
    });

    const crData = await crResponse.json();

    if (crData.status === "ok") {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      })
    } else {
      return new Response(JSON.stringify({ success: false, message: "Invalid token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, 
      })
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
