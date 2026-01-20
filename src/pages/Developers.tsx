import { motion } from 'framer-motion';
import { Terminal, Code2, Link as LinkIcon, Cpu } from 'lucide-react';
import './Developers.css';

const Developers = () => {
  return (
    <div className="developers-page">
      <section className="section-padding">
        <div className="container">
          <div className="dev-grid">
            <div className="dev-content">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="dev-badge">Beta Access</div>
                <h1 className="page-title">Built for <span className="text-gradient">Engineers</span></h1>
                <p className="page-subtitle">
                  NeuroLattice integrates directly into your ML stack. Whether you use PyTorch, TensorFlow, or JAX, our restructuring pipeline delivers optimized artifacts without changing your training logic.
                </p>
                <div className="dev-features">
                  <div className="dev-feature">
                    <Terminal size={20} className="text-sky-400" />
                    <span>Simple CLI integration</span>
                  </div>
                  <div className="dev-feature">
                    <Code2 size={20} className="text-sky-400" />
                    <span>C++ & Python Runtimes</span>
                  </div>
                  <div className="dev-feature">
                    <Cpu size={20} className="text-sky-400" />
                    <span>Optimized for NVIDIA & ARM</span>
                  </div>
                </div>
                <button className="btn-primary dev-cta">Contact for Early Access</button>
              </motion.div>
            </div>

            <div className="dev-visual-wrapper">
              <motion.div 
                className="dev-diagram glass"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="diagram-header">
                  <LinkIcon size={16} /> Workflow Integration
                </div>
                <div className="diagram-body">
                  <div className="diag-node">Training Loop</div>
                  <div className="diag-arrow"></div>
                  <div className="diag-node highlight">NeuroLattice Commit</div>
                  <div className="diag-arrow"></div>
                  <div className="diag-nodes-row">
                    <div className="diag-node small">ONNX</div>
                    <div className="diag-node small">TensorRT</div>
                  </div>
                  <div className="diag-arrow"></div>
                  <div className="diag-node">Production Deployment</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Developers;
