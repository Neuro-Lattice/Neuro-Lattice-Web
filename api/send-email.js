import emailjs from '@emailjs/nodejs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, models, spend } = req.body;

  // Read vars from process.env (Server Side) with trim()
  const serviceId = process.env.VITE_EMAILJS_SERVICE_ID?.trim();
  const templateId = process.env.VITE_EMAILJS_TEMPLATE_ID?.trim();
  const publicKey = process.env.VITE_EMAILJS_PUBLIC_KEY?.trim();
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();

  // Initializing with keys (Public AND Private)
  emailjs.init({
    publicKey: publicKey,
    privateKey: privateKey,
  });

  if (!serviceId || !templateId || !publicKey || !privateKey) {
     const missing = [];
     if (!serviceId) missing.push('VITE_EMAILJS_SERVICE_ID');
     if (!templateId) missing.push('VITE_EMAILJS_TEMPLATE_ID');
     if (!publicKey) missing.push('VITE_EMAILJS_PUBLIC_KEY');
     if (!privateKey) missing.push('EMAILJS_PRIVATE_KEY');

     const allKeys = Object.keys(process.env).filter(k => k.startsWith('VITE_') || k.startsWith('EMAILJS'));
     return res.status(500).json({ 
       error: `Backend Config Error. Missing keys: ${missing.join(', ')}`,
       debug: `Available Keys: ${allKeys.join(', ')}`
     });
  }

  const templateParams = {
    title: `New Inquiry from ${company || 'Website'}`,
    name: name,
    email: email,
    message: `
User Email: ${email}
Company: ${company || 'N/A'}
Models: ${models || 'Not specified'}
Spend: ${spend}
    `
  };

  try {
    // Correct usage of emailjs nodejs send
    const response = await emailjs.send(serviceId, templateId, templateParams);
    
    return res.status(200).json({ success: true, text: response.text });
  } catch (error) {
    return res.status(500).json({ 
        error: `EmailJS Library Error: ${error.text || error.message}`,
        debug: JSON.stringify(error)
    });
  }
}
