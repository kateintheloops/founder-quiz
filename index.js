export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
    let body;
    try { body = await request.json(); } catch { return new Response("Invalid JSON", { status: 400 }); }
    const { email, first_name, utm_campaign } = body;
    if (!email) return new Response("Email required", { status: 400 });
    const payload = {
      email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: "solo-founder-quiz",
      utm_medium: "quiz",
      utm_campaign: utm_campaign || "quiz",
      automation_ids: ["aut_845a45bb-3483-4370-bd40-be423aab754a"],
    };
    if (first_name) payload.custom_fields = [{ name: "first_name", value: first_name }];
    const res = await fetch(
      "https://api.beehiiv.com/v2/publications/pub_c281e370-f749-4d32-a1c0-07818208f511/subscriptions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + env.BEEHIIV_API_KEY,
        },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  },
};
