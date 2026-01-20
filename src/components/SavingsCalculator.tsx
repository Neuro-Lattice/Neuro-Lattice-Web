import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './SavingsCalculator.css';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Database, Zap } from 'lucide-react';

const GPU_DATA = {
  'T4': { cost: 0.35, vram: 16, bw: 300 },
  'L4': { cost: 0.80, vram: 24, bw: 600 },
  'A10': { cost: 1.00, vram: 24, bw: 600 },
  'A100': { cost: 3.50, vram: 80, bw: 2000 },
  'H100': { cost: 8.50, vram: 80, bw: 3350 },
};

const DEPLOYMENT = {
  'Cloud (On-demand)': 1.0,
  'Cloud (Reserved)': 0.6,
  'Private / Colocation': 1.0
};

const TRUTH_REDUCTION = 0.80; 
const η = 0.65; // Bandwidth efficiency floor

const SavingsCalculator = () => {
  const [gpuType, setGpuType] = useState<keyof typeof GPU_DATA>('A100');
  const [deployment, setDeployment] = useState<keyof typeof DEPLOYMENT>('Cloud (On-demand)');
  const [activationMem, setActivationMem] = useState<number>(2048);
  const [trafficValue, setTrafficValue] = useState<number>(100);
  const [trafficUnit, setTrafficUnit] = useState<'rps' | 'rpm'>('rps');
  const [mode, setMode] = useState<'capacity' | 'dollars'>('dollars');

  const handleUnitToggle = (unit: 'rps' | 'rpm') => {
    if (unit === trafficUnit) return;
    if (unit === 'rpm') {
      setTrafficValue(Math.round(trafficValue * 2592000));
    } else {
      setTrafficValue(Math.round(trafficValue / 2592000));
    }
    setTrafficUnit(unit);
  };

  const results = useMemo(() => {
    const gpu = GPU_DATA[gpuType];
    const costPerHour = gpu.cost * DEPLOYMENT[deployment];
    
    const rpm = trafficUnit === 'rpm' ? trafficValue : trafficValue * 2592000;
    const rps = trafficUnit === 'rps' ? trafficValue : trafficValue / 2592000;

    const rBaseSingleGpu = (gpu.bw * 1024) / activationMem * η;
    const rNlSingleGpu = rBaseSingleGpu * 5.0;

    // 3. Infrastructure Required (Fleet Perspective)
    const gpusNeededBase = Math.max(1, Math.ceil(rps / rBaseSingleGpu));
    const gpusNeededNl = Math.max(1, Math.ceil(rps / rNlSingleGpu));

    // 4. ROI Perspectives: Leverage & Avoided Spend
    // Simplification: Direct Monthly Savings on CURRENT traffic
    const hoursBase = rpm / rBaseSingleGpu / 3600;
    const hoursNl = rpm / rNlSingleGpu / 3600;
    const hoursReclaimed = hoursBase - hoursNl;
    
    // Cost to serve CURRENT traffic on Base vs NL
    const costBase = hoursBase * costPerHour;
    const costNl = hoursNl * costPerHour;
    
    const monthlySavings = costBase - costNl;

    // extraTrafficPerMonth (Capacity Mode)
    const extraTrafficPerMonth = hoursReclaimed * 3600 * rNlSingleGpu;

    // Physics ratios (Absolute Truth)
    const throughputRatio = 5.0; // (1 / 0.2)
    const costLeverage = 5.0; // Since we save 80% time, 1 / 0.2 = 5x efficiency

    return {
      nlActivation: activationMem * (1 - TRUTH_REDUCTION),
      monthlySavings,
      hoursReclaimed,
      extraTrafficPerMonth,
      effectiveGpusSaved: gpusNeededBase - gpusNeededNl,
      throughputRatio,
      costLeverage
    };
  }, [gpuType, deployment, activationMem, trafficValue, trafficUnit]);

  const formatCurrency = (val: number) => {
    if (val > 0 && val < 5) return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const formatNumber = (val: number) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(1) + 'B';
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    if (val > 0 && val < 1) return val.toFixed(2);
    if (val > 0 && val < 10) return val.toFixed(1);
    return val.toFixed(0);
  };

  return (
    <div className="calc-wrapper">
      <div className="calc-container">
        {/* Sidebar Controls */}
        <aside className="calc-sidebar">
          <div>
            <h4 className="sidebar-heading"><Database size={14} /> Current Workload</h4>
            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="input-block">
                <label>Baseline Traffic</label>
                <input 
                  type="number" 
                  value={trafficValue} 
                  onChange={(e) => setTrafficValue(Number(e.target.value))}
                />
              </div>
              <div className="unit-toggle">
                <button 
                  className={trafficUnit === 'rps' ? 'active' : ''} 
                  onClick={() => handleUnitToggle('rps')}
                >
                  Req / Sec
                </button>
                <button 
                  className={trafficUnit === 'rpm' ? 'active' : ''} 
                  onClick={() => handleUnitToggle('rpm')}
                >
                  Req / Month
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="sidebar-heading"><Zap size={14} /> Model & Fleet</h4>
            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="input-block">
                <label>Peak Activation (MB)</label>
                <input 
                  type="number" 
                  value={activationMem} 
                  onChange={(e) => setActivationMem(Number(e.target.value))}
                />
              </div>
              <div className="input-block">
                <label>GPU Hardware</label>
                <select value={gpuType} onChange={(e) => setGpuType(e.target.value as any)}>
                  {Object.keys(GPU_DATA).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="input-block">
                <label>Deploy Mode</label>
                <select value={deployment} onChange={(e) => setDeployment(e.target.value as any)}>
                  {Object.keys(DEPLOYMENT).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <Link to="/contact" className="cta-box small">
               <span>Get Your Model Now</span>
               <ArrowRight size={18} />
            </Link>
          </div>
        </aside>

        {/* Main Result Display */}
        <main className="calc-main">
          <div className="truth-hero">
            <h2 className="truth-title">
              Up to <span>80%</span> Less HBM Footprint.
            </h2>
            <p className="truth-subtitle">
              NeuroLattice restructures weights to bypass activation movement bottlenecks, reducing peak physical HBM load by up to 80%.
            </p>
          </div>

          <div className="calc-toggle">
            <button className={`toggle-btn ${mode === 'capacity' ? 'active' : ''}`} onClick={() => setMode('capacity')}>Leverage Capacity</button>
            <button className={`toggle-btn ${mode === 'dollars' ? 'active' : ''}`} onClick={() => setMode('dollars')}>Leverage Savings</button>
          </div>

          <div className="roi-grid">
            <AnimatePresence mode="wait">
              <motion.div 
                key={mode}
                className="roi-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="roi-val">
                  {mode === 'capacity' ? `+${formatNumber(results.extraTrafficPerMonth)}` : formatCurrency(results.monthlySavings)}
                </div>
                <div className="roi-label">
                  {mode === 'capacity' ? 'Extra Requests / Month' : 'Avoided Monthly Spend'}
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.div 
              className="roi-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="roi-val">
                {mode === 'dollars' ? `${formatNumber(results.hoursReclaimed)} hrs` : results.effectiveGpusSaved}
              </div>
              <div className="roi-label">
                {mode === 'dollars' ? 'Compute Hours Reclaimed' : 'Fewer GPUs Required'}
              </div>
            </motion.div>

            <motion.div 
              className="roi-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="roi-val">{results.throughputRatio.toFixed(1)}×</div>
              <div className="roi-label">Throughput Leverage</div>
            </motion.div>

            <motion.div 
              className="roi-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="roi-val">{results.costLeverage.toFixed(1)}×</div>
              <div className="roi-label">Budget Efficiency</div>
            </motion.div>
          </div>




        </main>
      </div>
    </div>
  );
};

export default SavingsCalculator;
