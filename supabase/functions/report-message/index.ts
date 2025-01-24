import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log("Received message to report:", message);

    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    if (!smtpPassword) {
      throw new Error("SMTP_PASSWORD environment variable is not set");
    }

    const client = new SmtpClient();

    const connectConfig = {
      hostname: "mail.maneblod.com",
      port: 465,
      username: "manebl@maneblod.com",
      password: smtpPassword,
    };

    console.log("Connecting to SMTP server...");
    await client.connectTLS(connectConfig);
    console.log("Connected to SMTP server");

    const emailContent = {
      from: "manebl@maneblod.com",
      to: "manebl@maneblod.com",
      subject: "Reported Message from Openera",
      content: `A message has been reported:\n\n${message}`,
    };

    console.log("Sending email...");
    await client.send(emailContent);
    console.log("Email sent successfully");

    await client.close();

    return new Response(
      JSON.stringify({ message: "Report sent successfully" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in report-message function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send report",
        details: error.message,
        stack: error.stack 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});