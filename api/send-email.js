export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vercel automatically parses JSON body
  const { name, email, company, models, spend } = req.body;

  // Read vars from process.env (Server Side)
  const serviceId = process.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = process.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.VITE_EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY; // New Requirement

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    return res.status(500).json({ error: 'Missing backend configuration. Need EMAILJS_PRIVATE_KEY.' });
  }

  // Construct the template parameters exactly as the frontend did
  const templateParams = {
    title: `New Inquiry from ${company || 'Website'}`,
    name: name,
    email: email, // Maps to Reply To
    message: `
User Email: ${email}
Company: ${company || 'N/A'}
Models: ${models || 'Not specified'}
Spend: ${spend}
    `
  };

  try {
    // Send to EmailJS REST API
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey, // Required for Non-Browser Requests
        template_params: templateParams,
      }),
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `EmailJS Error: ${errorText}` });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
}
