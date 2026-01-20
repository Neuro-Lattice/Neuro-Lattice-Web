import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Building2, TrendingUp } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <section className="section-padding">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="page-title">Talk to <span className="text-gradient">Us</span></h1>
                <p className="page-subtitle">
                  Ready to reduce your infra spend? Tell us about your models and we'll show you how much you can save.
                </p>

                <div className="contact-methods">
                  <div className="method">
                    <Mail className="text-sky-400" size={24} />
                    <div>
                      <div className="method-label">Email</div>
                      <div className="method-value">satyam@neuro-lattice.com</div>
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>

            <motion.div 
              className="contact-form-wrapper glass"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                {/* Simple state management to disable button if empty */}
                <ValidatedForm />
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};



const ValidatedForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [models, setModels] = useState('');
  const [spend, setSpend] = useState('Under $5k');
  const [isSending, setIsSending] = useState(false);
  
  const isValid = name.trim().length > 0 && email.trim().length > 0 && company.trim().length > 0;

  const handleSend = async () => {
    if (!isValid) return;
    setIsSending(true);

    try {
      // Securely send via our Vercel Backend Proxy
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          company,
          models,
          spend
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Message sent successfully!');
        // Reset form
        setName('');
        setEmail('');
        setCompany('');
        setModels('Computer Vision (ResNet, ViT, etc.)');
        setSpend('Under $5k');
      } else {
        const errorMsg = data.error || 'Server rejected request';
        const debugMsg = data.debug ? `\n\nDEBUG INFO:\n${data.debug}` : '';
        throw new Error(errorMsg + debugMsg);
      }

    } catch (error: any) {
      console.error('FAILED...', error);
      alert('Failed to send: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="form-group">
        <label><Building2 size={16} /> Name <span style={{ color: 'var(--accent-primary)' }}>*</span></label>
        <input 
          type="text" 
          placeholder="Your Name" 
          required 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Email <span style={{ color: 'var(--accent-primary)' }}>*</span></label>
        <input 
          type="email" 
          placeholder="name@work-email.com" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Company <span style={{ color: 'var(--accent-primary)' }}>*</span></label>
        <input 
          type="text" 
          placeholder="Your Company" 
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>What models do you run?</label>
        <input 
          type="text" 
          placeholder="e.g. Llama 3, ResNet-50, SDXL..."
          value={models} 
          onChange={(e) => setModels(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label><TrendingUp size={16} /> Monthly infra spend range (optional)</label>
        <select value={spend} onChange={(e) => setSpend(e.target.value)}>
          <option>Under $5k</option>
          <option>$5k - $50k</option>
          <option>$50k - $250k</option>
          <option>$250k+</option>
        </select>
      </div>
      <button 
        className="btn-primary form-submit" 
        disabled={!isValid || isSending}
        onClick={handleSend}
        type="button"
        style={{ opacity: (isValid && !isSending) ? 1 : 0.5, cursor: (isValid && !isSending) ? 'pointer' : 'not-allowed' }}
      >
        {isSending ? 'Sending...' : 'Send Message'}
      </button>
    </>
  );
};

export default Contact;
