import { motion } from 'framer-motion';
import { Github, Server, Zap } from 'lucide-react';
import './Models.css';

const Models = () => {
  // Data extraction completed from user images
  const chartData = {
    latency: [
      { label: 'Standard (FP32)', val: 1.967, display: '1.967 ms', max: 2.0, color: '#64748b' },
      { label: 'Standard (FP16)', val: 0.128, display: '0.128 ms', max: 2.0, color: '#94a3b8' },
      { label: 'NeuroLattice (FP16)', val: 0.026, display: '0.026 ms', max: 2.0, color: '#10b981' }
    ],
    memory: [
      { label: 'Standard ResNet-18 (FP32)', val: 5270.23, display: '5,270 MB', max: 5500, color: '#64748b' },
      { label: 'Standard ResNet-18 (FP16)', val: 3178.55, display: '3,178 MB', max: 5500, color: '#94a3b8' },
      { label: 'NeuroLattice (FP16)', val: 876.73, display: '876 MB', max: 5500, color: '#10b981' }
    ],
    params: [
      { label: 'Standard ResNet-18', val: 11.69, display: '11.69 M', max: 19, color: '#64748b' },
      { label: 'CIFAR-ResNet-18', val: 11.72, display: '11.72 M', max: 19, color: '#64748b' },
      { label: 'SE-ResNet-18', val: 11.85, display: '11.85 M', max: 19, color: '#64748b' },
      { label: 'ECA-ResNet-18', val: 11.71, display: '11.71 M', max: 19, color: '#64748b' },
      { label: 'BlurPool ResNet-18', val: 11.73, display: '11.73 M', max: 19, color: '#64748b' },
      { label: 'Wide ResNet-18', val: 18.20, display: '18.20 M', max: 19, color: '#64748b' },
      { label: 'Bottleneck-ResNet', val: 10.80, display: '10.80 M', max: 19, color: '#64748b' },
      { label: 'Ghost-ResNet-18', val: 9.00, display: '9.00 M', max: 19, color: '#64748b' },
      { label: 'NeuroLattice', val: 2.37, display: '2.37 M', max: 19, color: '#10b981' }
    ],
    accuracy: [
      { label: 'Standard ResNet-18', val: 91.45, display: '91.45%', max: 95, color: '#64748b', min: 90 },
      { label: 'CIFAR-ResNet-18', val: 92.65, display: '92.65%', max: 95, color: '#64748b', min: 90 },
      { label: 'SE-ResNet-18', val: 93.00, display: '93.00%', max: 95, color: '#64748b', min: 90 },
      { label: 'ECA-ResNet-18', val: 92.40, display: '92.40%', max: 95, color: '#64748b', min: 90 },
      { label: 'BlurPool', val: 91.95, display: '91.95%', max: 95, color: '#64748b', min: 90 },
      { label: 'Wide ResNet-18', val: 94.00, display: '94.00%', max: 95, color: '#64748b', min: 90 },
      { label: 'Bottleneck', val: 90.75, display: '90.75%', max: 95, color: '#64748b', min: 90 },
      { label: 'Ghost-ResNet-18', val: 91.15, display: '91.15%', max: 95, color: '#64748b', min: 90 },
      { label: 'NeuroLattice', val: 91.24, display: '91.24%', max: 95, color: '#10b981', min: 90 }
    ]
  };

  const BarChart = ({ data, title }: { data: any[], title: string }) => (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      {data.map((item, i) => (
        <div key={i} className="bar-chart-row">
          <span className="bar-label">{item.label}</span>
          <div className="bar-track">
            <motion.div 
              className="bar-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${(item.val / item.max) * 100}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              style={{ backgroundColor: item.color }}
            />
          </div>
          <span className="bar-value" style={{ color: item.color === '#64748b' ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
            {item.display}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="models-page">
      <div className="container">
        <div className="models-header">
          <h1 className="page-title">Available Models</h1>
          <p className="page-subtitle">Production-ready, optimized benchmarks for immediate deployment.</p>
        </div>

        <motion.div 
          className="model-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="model-header-row">
            <div className="model-title-group">
              <div className="model-tags">
                <span className="model-tag highlight">Computer Vision</span>
                <span className="model-tag">Classification</span>
                <span className="model-tag">CIFAR-10</span>
                <span className="model-tag">Open Source</span>
              </div>
              <h2>ResNet-18-micro-80</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>
                An extreme optimization of the standard ResNet-18 architecture. 
                Achieves <strong>5x higher throughput</strong> and <strong>80% fewer parameters</strong> with negligible accuracy loss.
              </p>
            </div>
            
            <div className="model-links">
              <a 
                href="https://github.com/Neuro-Lattice/NeuroLattice-Micro-Models" 
                target="_blank"
                rel="noopener noreferrer"
                className="model-btn github"
              >
                <Github size={18} /> GitHub
              </a>
              <a 
                href="https://huggingface.co/Neuro-Lattice/resnet-18-micro-80" 
                target="_blank"
                rel="noopener noreferrer"
                className="model-btn huggingface"
              >
                <img 
                  src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" 
                  alt="🤗" 
                  style={{ width: '20px', height: '20px', marginRight: '6px' }} 
                /> Hugging Face
              </a>
            </div>
          </div>

          <div className="status-badges" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <Zap size={16} color="#10b981" /> <span>Low Latency (0.026ms)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <Server size={16} color="#10b981" /> <span>Low Memory (876MB)</span>
            </div>
          </div>

          <div className="charts-grid">
            <BarChart 
              title="Inference Latency (ms)" 
              data={chartData.latency} 
            />
            <BarChart 
              title="Peak GPU Memory (MB)" 
              data={chartData.memory} 
            />
            <BarChart 
              title="Model Parameters (Millions)" 
              data={chartData.params} 
            />
            <BarChart 
              title="Accuracy on CIFAR-10 (%)" 
              data={chartData.accuracy} 
            />
          </div>
          
          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', opacity: 0.6 }}>
            Benchmarked on NVIDIA GeForce RTX 4050 Laptop GPU | CUDA 12.1 | FP16 | Batch Size: 4096
          </div>
        </motion.div>

        {/* Coming Soon Section */}
        <div style={{ textAlign: 'center', marginTop: '64px', paddingBottom: '64px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>More Models Shipping Soon</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            We are actively benchmarking and optimizing Vision Transformers (ViT), Stable Diffusion, and Llama-series LLMs. 
            <br />
            <a href="/contact" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '600' }}>Contact us</a> to request a specific architecture.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Models;
