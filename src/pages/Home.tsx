import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  BarChart3,
  Server,
  Users
} from 'lucide-react';
import './Home.css';
import { Link } from 'react-router-dom';
import SavingsCalculator from '../components/SavingsCalculator';
import SEO from '../components/SEO';

const Home = () => {
  const scrollToCalculator = () => {
    const calcSection = document.getElementById('savings-calculator');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">
      <SEO 
        title="NeuroLattice | 10x Faster Inference & 80% Cost Reduction" 
        description="Unlock 10x faster AI inference and cut infrastructure costs by 80% with NeuroLattice's structural optimization. Built for high-scale enterprise production workloads." 
      />
      {/* 1. HERO SECTION */}
      {/* 1. HERO SECTION */}
      <section className="hero-section section-padding">
        <div className="container">
          <div className="hero-grid-layout">
            {/* Left Column: Text & CTA */}
            <motion.div 
              className="hero-left-content"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="hero-tagline left-align">
                <span className="text-gradient">Scaling Intelligence,</span> <span className="text-muted">Not Compute</span>
              </h1>
              
              <p className="hero-value-prop left-align">
                Run your existing models at <span className="highlight-text">30–80% lower cost</span> — without changing accuracy or infrastructure.
              </p>

              <p className="hero-target left-align">
                Built for teams hosting models on their own GPUs or cloud infrastructure.
              </p>
              
              <div className="hero-actions-left">
                <button className="btn-primary hero-btn" onClick={scrollToCalculator}>
                  Calculate Your Cost Savings
                </button>
              </div>
            </motion.div>

            {/* Right Column: Visualized Stats */}
            <motion.div 
              className="hero-right-visuals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="hero-stats-container glass">
                <div className="hero-stat-row">
                  <div className="stat-header">
                    <span>Model Parameters</span>
                    <span className="stat-highlight-green">-80%</span>
                  </div>
                  <div className="stat-bar-group">
                    <div className="stat-bar-wrapper">
                      <div className="stat-bar-label">Standard</div>
                      <div className="stat-bar-track"><div className="stat-bar-fill grey" style={{ width: '100%' }}></div></div>
                    </div>
                    <div className="stat-bar-wrapper">
                      <div className="stat-bar-label">NL</div>
                      <div className="stat-bar-track"><div className="stat-bar-fill green" style={{ width: '20%' }}></div></div>
                    </div>
                  </div>
                </div>

                <div className="hero-stat-row">
                  <div className="stat-header">
                    <span>HBM Usage</span>
                    <span className="stat-highlight-green">-72%</span>
                  </div>
                  <div className="stat-bar-group">
                    <div className="stat-bar-wrapper">
                      <div className="stat-bar-label">Standard</div>
                      <div className="stat-bar-track"><div className="stat-bar-fill grey" style={{ width: '100%' }}></div></div>
                    </div>
                    <div className="stat-bar-wrapper">
                      <div className="stat-bar-label">NL</div>
                      <div className="stat-bar-track"><div className="stat-bar-fill green" style={{ width: '28%' }}></div></div>
                    </div>
                  </div>
                </div>

                <div className="hero-stat-row">
                  <div className="stat-header">
                    <span>Throughput</span>
                    <span className="stat-highlight-green">5x Boost</span>
                  </div>
                  <div className="stat-bar-group">
                    <div className="stat-bar-wrapper">
                      <div className="stat-bar-label">Standard</div>
                      <div className="stat-bar-track"><div className="stat-bar-fill grey" style={{ width: '20%' }}></div></div>
                    </div>
                    <div className="stat-bar-wrapper">
                      <div className="stat-bar-label">NL</div>
                      <div className="stat-bar-track"><div className="stat-bar-fill green" style={{ width: '100%' }}></div></div>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '24px', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                  Benchmarked on ResNet-18 (FP16)
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. CALCULATOR SECTION */}
      <section id="savings-calculator" className="calculator-anchor-section section-padding">
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-title-large">See how much you’re overpaying for inference</h2>
          </div>
          <SavingsCalculator />
        </div>
      </section>

      {/* 4. WHO IS THIS FOR */}
      <section className="audience-section section-padding alternate-bg">
        <div className="container">
          <h2 className="section-title-large">Built for anyone who runs models in production</h2>
          <div className="audience-grid-new">
            <div className="audience-card-new">
              <div className="audience-icon-wrapper"><Server /></div>
              <div className="audience-info">
                <h4>Teams hosting ML APIs</h4>
                <p>Reducing cost per request directly improves margins.</p>
              </div>
            </div>
            <div className="audience-card-new">
              <div className="audience-icon-wrapper"><BarChart3 /></div>
              <div className="audience-info">
                <h4>AI platform & infra teams</h4>
                <p>Increase GPU utilization, reduce memory bottlenecks, defer hardware spend.</p>
              </div>
            </div>
            <div className="audience-card-new">
              <div className="audience-icon-wrapper"><Users /></div>
              <div className="audience-info">
                <h4>AI-first startups & enterprises</h4>
                <p>Run larger models or serve more traffic on the same infrastructure.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="final-cta-section section-padding">
        <div className="container text-center">
          <h2 className="final-title">If you’re hosting models today, you’re likely overpaying for inference.</h2>
          <div className="final-actions">
            <Link to="/contact">
              <button className="btn-primary final-btn large">Request a Dedicated Benchmark <ArrowRight size={18} /></button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
