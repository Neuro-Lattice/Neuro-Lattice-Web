import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Cpu, Database, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import './HostedApiRequest.css';

const HostedApiRequest = () => {
  const [submitted, setSubmitted] = useState(false);
  const [modelType, setModelType] = useState<'os' | 'custom'>('os');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (submitted) {
    return (
      <div className="api-request-page">
        <div className="request-container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="form-card glass"
            style={{ alignItems: 'center', textAlign: 'center' }}
          >
            <CheckCircle2 size={64} color="#10b981" style={{ marginBottom: '24px' }} />
            <h1 style={{ marginBottom: '16px' }}>Request Received</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '500px' }}>
              Our engineering team is reviewing your model and requirements. We will contact you shortly to begin the optimization and hosting process.
            </p>
            <button className="btn-primary" onClick={() => window.location.href = '/'}>
              Return to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="api-request-page">
      <div className="request-container">
        <div className="request-header">
          <span className="truth-tag">Hosted API</span>
          <h1>Host Your Optimized Model</h1>
          <p className="page-subtitle">Submit your model and training data to unlock 2.5× throughput on our high-performance fleet.</p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="form-card glass"
        >
          {/* Section 1: Model Details */}
          <div className="form-section">
            <div className="section-label">
              <Cpu size={20} />
              <span>Model Architecture</span>
            </div>
            
            <div className="form-group">
              <label>Model Source</label>
              <select 
                value={modelType} 
                onChange={(e) => setModelType(e.target.value as any)}
              >
                <option value="os">Open Source (Llama, Mistral, SDXL, etc.)</option>
                <option value="custom">Custom Architecture / Private Weights</option>
              </select>
            </div>

            {modelType === 'os' ? (
              <div className="form-group">
                <label>Model Name (e.g. Llama-3-8B-Instruct)</label>
                <input type="text" placeholder="Enter HuggingFace ID or model name" required />
              </div>
            ) : (
              <div className="upload-zone">
                <Upload className="upload-icon" size={32} />
                <div className="upload-text">
                  <strong>Upload Model Artifact</strong>
                  <p>Drag and drop (.pth, .onnx, .safetensors) or click to browse</p>
                </div>
                <input type="file" style={{ display: 'none' }} id="model-upload" />
              </div>
            )}
          </div>

          <hr style={{ opacity: 0.1, border: 'none', borderTop: '1px solid white', margin: '8px 0' }} />

          {/* Section 2: Fine-Tuning Data */}
          <div className="form-section">
            <div className="section-label">
              <Database size={20} />
              <span>Fine-Tuning & Data Details</span>
            </div>
            
            <div className="form-group">
              <label>Project Scope & Data Description</label>
              <textarea 
                rows={4} 
                placeholder="Describe the specialized data or domain you'd like to fine-tune on..." 
                required
              ></textarea>
            </div>

            <div className="upload-zone">
              <Database className="upload-icon" size={32} />
              <div className="upload-text">
                <strong>Upload Partial Dataset (Optional)</strong>
                <p>Upload a sample of your fine-tuning data (.jsonl, .csv)</p>
              </div>
              <input type="file" style={{ display: 'none' }} id="data-upload" />
            </div>
          </div>

          <hr style={{ opacity: 0.1, border: 'none', borderTop: '1px solid white', margin: '8px 0' }} />

          {/* Section 3: Contact */}
          <div className="form-section">
            <div className="section-label">
              <User size={20} />
              <span>Contact Information</span>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Company Email</label>
                <input type="email" placeholder="name@company.com" required />
              </div>
              <div className="form-group">
                <label>Workload Estimate (Req / Month)</label>
                <input type="text" placeholder="e.g. 10 Million" required />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary submit-btn">
            Submit Early API Request <ArrowRight size={20} />
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default HostedApiRequest;
