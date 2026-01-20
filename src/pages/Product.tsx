import { motion } from 'framer-motion';
import { Box, Shield, ArrowRight } from 'lucide-react';
import './Product.css';

interface ModeCardProps {
  title: string;
  description: string;
  visual: React.ComponentType;
  features: string[];
  badge?: string;
  isDark?: boolean;
  link?: string;
  buttonText?: string;
}

const ModeCard = ({ title, description, visual: Visual, features, badge, isDark = false, link, noButton = false, buttonText }: ModeCardProps & { noButton?: boolean }) => {
  const navigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <motion.div 
      className={`mode-card glass ${isDark ? 'dark-mode' : ''}`}
      whileHover={{ y: -5 }}
    >
      {badge && <div className="mode-badge">{badge}</div>}
      <div className="mode-main">
        <div className="mode-info">
          <h2 className="mode-title">{title}</h2>
          <p className="mode-description">{description}</p>
          <ul className="mode-features">
            {features.map((f: string, i: number) => (
              <li key={i}><ArrowRight size={14} className="feature-arrow" /> {f}</li>
            ))}
          </ul>
        </div>
        <div className="mode-visual">
          <Visual />
        </div>
      </div>
      {!noButton && (
        <div className="mode-btn-group" style={{ display: 'flex', gap: '12px' }}>
          <button 
            className={`mode-btn ${isDark ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => link ? navigate(link) : null}
          >
            {buttonText || (link ? 'Request API Access' : (isDark ? 'Inquire for Enterprise' : 'Learn More'))}
          </button>
          
          {/* Specific Logic for Request Button */}
          {buttonText === 'Search for Your Model' && (
            <button 
              className={`mode-btn ${isDark ? 'btn-secondary' : 'btn-primary'}`}
              style={{ background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}
              onClick={() => navigate('/contact')}
            >
              Request for a new model
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

const Product = () => {
  const modes = [
    {
      title: 'Optimized Models',
      description: 'Infra / ML teams running models on their own GPUs who want immediate cost and throughput wins without changing serving stacks.',
      badge: 'Self-Hosted Teams',
      link: '/models',
      buttonText: 'Search for Your Model',
      features: [
        'Structurally optimized models (HBM-aware)',
        'Kernel-safe, static graph execution',
        'Drop-in replacements (Same inputs/outputs)',
        'Framework-native exports (PT/ONNX/TRT)',
        'Predictable p99 latency under load',
        'No runtime controllers / no dynamic execution'
      ],
      visual: () => (
        <div className="visual-box model-box">
          <Box className="model-icon" size={48} />
          <div className="model-label">optimized_v1.tar.gz</div>
          <div className="model-meta">452K params | 4MB</div>
        </div>
      )
    },
    {
      title: 'Hosted APIs',
      description: 'Teams that want to validate cost savings quickly or don’t want to manage infra. Optimization-as-a-service layer.',
      badge: 'Early Access / Low Friction',
      link: '/contact',
      buttonText: 'Early Access',
      features: [
        'Upload → optimized endpoint',
        'Latency- or cost-targeted optimization',
        'Production-grade isolation (no noisy neighbors)',
        'Pay per optimized inference'
      ],
      visual: () => (
        <div className="visual-box api-box">
          <div className="api-header">POST /v1/restructure</div>
          <div className="api-body">
            <span className="code-key">"model"</span>: <span className="code-val">"resnet18_dense"</span>,<br/>
            <span className="code-key">"target"</span>: <span className="code-val">"latency_optimized"</span>
          </div>
          <div className="api-footer">Status: 200 OK</div>
        </div>
      )
    },
    {
      title: 'Enterprise Runtime',
      description: 'Large orgs with multiple models, hardware targets, and internal platforms.',
      badge: 'Coming Soon',
      isDark: true,
      link: '/contact',
      buttonText: 'Early Access',
      features: [
        'In-house optimization pipeline',
        'Runtime enforcement (static graph constraints)',
        'Unified training → inference optimization',
        'Hardware-aware variants (A10, L4, A100)',
        'Auditability & rollback'
      ],
      visual: () => (
        <div className="visual-box runtime-box">
          <div className="runtime-layer">Training Loop</div>
          <div className="runtime-bridge"><Shield size={20} /></div>
          <div className="runtime-layer highlight">NeuroLattice Runtime</div>
          <div className="runtime-bridge"></div>
          <div className="runtime-layer">Hardware (GPU/NPU)</div>
        </div>
      )
    }
  ];

  return (
    <div className="product-page">
      <section className="section-padding">
        <div className="container">
          <div className="header-center">
            <h1 className="page-title">How Teams Use <span className="text-gradient">NeuroLattice</span></h1>
            <p className="page-subtitle">Scalable efficiency modes tailored to your infrastructure requirements.</p>
          </div>

          <div className="modes-list">
            {modes.map((mode, i) => (
              <ModeCard key={i} {...mode} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;
