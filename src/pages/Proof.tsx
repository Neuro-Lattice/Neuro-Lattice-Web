import { motion } from 'framer-motion';
import { TrendingDown, Cpu, BarChart3 } from 'lucide-react';
import './Proof.css';

const Proof = () => {
  const baselineData = [
    { metric: 'Parameters', value: '11.0M' },
    { metric: 'Activation Memory', value: '~90 MB' },
    { metric: 'Top-1 Accuracy', value: '~90%' },
    { metric: 'FLOPs', value: '1.8G' },
  ];

  const neuroData = [
    { metric: 'Parameters', value: '452K', change: '↓ 96%' },
    { metric: 'Activation Memory', value: '~4 MB', change: '↓ 95%' },
    { metric: 'Top-1 Accuracy', value: '88%', note: 'Stable training' },
    { metric: 'FLOPs', value: '72M', change: '↓ 96%' },
  ];

  return (
    <div className="proof-page">
      <section className="section-padding">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="proof-header"
          >
            <h1 className="page-title">Proof: Structural Compression on <span className="text-gradient">ResNet-18</span></h1>
            <p className="page-subtitle">Real numbers from our latest restructuring pipeline.</p>
          </motion.div>

          <div className="proof-grid">
            {/* Baseline Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="proof-card baseline glass"
            >
              <h2 className="card-heading">1. Baseline</h2>
              <p className="card-subtext">The standard dense ResNet-18 architecture.</p>
              <div className="data-table">
                {baselineData.map((item, i) => (
                  <div key={i} className="data-row">
                    <span className="data-label">{item.metric}</span>
                    <span className="data-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* NeuroLattice Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="proof-card result glass accent-border"
            >
              <div className="card-badge">After NeuroLattice</div>
              <h2 className="card-heading">2. Restructured</h2>
              <p className="card-subtext">Optimized using geometry-preserving projection.</p>
              <div className="data-table">
                {neuroData.map((item, i) => (
                  <div key={i} className="data-row">
                    <span className="data-label">{item.metric}</span>
                    <div className="value-group">
                      <span className="data-value highlight">{item.value}</span>
                      {item.change && <span className="change-tag">{item.change}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Why it matters */}
          <div className="matters-section">
            <h2 className="section-title text-center">Why this matters</h2>
            <div className="matters-grid">
              <div className="matters-card glass">
                <Cpu className="text-sky-400" />
                <h3>Smaller models → cheaper GPUs</h3>
                <p>Reduced parameter count allows for deployment on lower-tier hardware without performance bottlenecks.</p>
              </div>
              <div className="matters-card glass">
                <TrendingDown className="text-sky-400" />
                <h3>Lower activations → lower HBM pressure</h3>
                <p>Massive reduction in activation memory relieves High Bandwidth Memory bottlenecks, enabling higher batch sizes.</p>
              </div>
              <div className="matters-card glass">
                <BarChart3 className="text-sky-400" />
                <h3>Structural pruning → actual speedups</h3>
                <p>We don't just rely on "sparse illusions". Our restructuring delivers real-world latency improvements on commodity hardware.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Proof;
