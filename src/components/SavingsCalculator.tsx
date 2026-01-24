import { useState, useMemo } from 'react';
import './SavingsCalculator.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Zap, Info } from 'lucide-react';

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

  const handleGenerateReport = () => {
    import('jspdf').then(({ default: jsPDF }) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        
        // --- Colors ---
        const BRAND_DARK: [number, number, number] = [15, 23, 42];  // Slate 900
        const BRAND_GREEN: [number, number, number] = [16, 185, 129]; // Emerald 500
        const TEXT_GRAY: [number, number, number] = [71, 85, 105];  // Slate 600
        const TEXT_LIGHT: [number, number, number] = [148, 163, 184]; // Slate 400

        // --- Helper Helpers ---
        // Recalculate internals for precise table data
        const gpu = GPU_DATA[gpuType];
        const costPerHour = gpu.cost * DEPLOYMENT[deployment];
        const rpm = trafficUnit === 'rpm' ? trafficValue : trafficValue * 2592000;
        const rBaseSingleGpu = (gpu.bw * 1024) / activationMem * η;
        const rNlSingleGpu = rBaseSingleGpu * 5.0; 
        
        const hoursBase = rpm / rBaseSingleGpu / 3600;
        const hoursNl = rpm / rNlSingleGpu / 3600;
        
        const costBase = hoursBase * costPerHour;
        const costNl = hoursNl * costPerHour;
        // --- Header (Page 1) ---
        // @ts-ignore
        doc.setFillColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
        doc.rect(0, 0, pageWidth, 35, 'F');
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("NeuroLattice Inference Efficiency Impact Report", 14, 15);
        
        doc.setFontSize(10);
        doc.setTextColor(200, 200, 200);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated: ${new Date().toLocaleDateString()} | Config: ${gpuType} / ${deployment}`, 14, 25);

        let finalY = 45;

        // --- Executive Summary ---
        doc.setFontSize(12); // Slightly smaller heading
        // @ts-ignore
        doc.setTextColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
        doc.setFont("helvetica", "bold");
        doc.text("Executive Summary", 14, finalY);
        
        finalY += 6;
        doc.setFontSize(9); // Slightly smaller body
        // @ts-ignore
        doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);
        doc.setFont("helvetica", "normal");
        
        const execSummary = "AI inference is now a recurring operating cost that scales directly with usage. Without structural efficiency, infrastructure spend grows faster than revenue and limits deployment flexibility.\n\nThis report evaluates how NeuroLattice reduces inference cost at the execution level, allowing organizations to lower monthly cloud spend while unlocking additional throughput on existing hardware. The analysis below details both immediate cost impact and longer-term scale implications.";
        
        const splitExec = doc.splitTextToSize(execSummary, pageWidth - 28);
        doc.text(splitExec, 14, finalY);
        finalY += doc.getTextDimensions(splitExec).h + 10;

        // --- CHART 1: Monthly Spend Comparison (Vertical Bar) ---
        doc.setFontSize(12);
        // @ts-ignore
        doc.setTextColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
        doc.setFont("helvetica", "bold");
        doc.text("1. Projected Monthly Spend Reduction", 14, finalY);
        
        finalY += 6;
        
        const chartHeight = 28; // Hard reduction
        const chartBaseY = finalY + chartHeight;
        const maxCost = costBase * 1.2; // 20% headroom
        const scaleY = chartHeight / maxCost;
        
        // Axis calculation for centering
        const barWidth = 18; // Narrower
        const gap = 20;
        const totalChartWidth = barWidth * 2 + gap;
        const startX1 = (pageWidth - totalChartWidth) / 2;

        // Axis Line
        doc.setDrawColor(200, 200, 200);
        doc.line(startX1 - 15, chartBaseY, startX1 + totalChartWidth + 15, chartBaseY); // X-axis (Centered)

        // Baseline Bar
        const b1X = startX1;
        const b1H = costBase * scaleY;
        // @ts-ignore
        doc.setFillColor(220, 38, 38); // Red-600
        doc.rect(b1X, chartBaseY - b1H, barWidth, b1H, 'F');
        
        // NeuroLattice Bar
        const b2X = startX1 + barWidth + gap; 
        const b2H = costNl * scaleY;
        // @ts-ignore
        doc.setFillColor(BRAND_GREEN[0], BRAND_GREEN[1], BRAND_GREEN[2]);
        doc.rect(b2X, chartBaseY - b2H, barWidth, b2H, 'F');

        // Labels
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text("Baseline", b1X + barWidth/2, chartBaseY + 4, { align: 'center' });
        doc.text("With NeuroLattice", b2X + barWidth/2, chartBaseY + 4, { align: 'center' });
        
        // Values on Top
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(formatCurrency(costBase), b1X + barWidth/2, chartBaseY - b1H - 2, { align: 'center' });
        // @ts-ignore
        doc.setTextColor(BRAND_GREEN[0], BRAND_GREEN[1], BRAND_GREEN[2]);
        doc.text(formatCurrency(costNl), b2X + barWidth/2, chartBaseY - b2H - 2, { align: 'center' });

        // Savings Annotation
        doc.setFontSize(9);
        // @ts-ignore
        doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);
        doc.setFont("helvetica", "normal");
        doc.text(`Savings: ${(100 - (costNl / costBase * 100)).toFixed(0)}%`, b2X + barWidth + 10, chartBaseY - (b1H/2));

        // Increment Y to move past the chart
        finalY += chartHeight + 12; 

        // --- INTERPRETATION 1: Monthly Spend ---
        doc.setFontSize(9);
        // @ts-ignore
        doc.setTextColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
        doc.setFont("helvetica", "bold");
        doc.text("Interpretation", 14, finalY);
        finalY += 4;

        doc.setFont("helvetica", "normal");
        // @ts-ignore
        doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);
        
        const interpret1 = `This comparison illustrates the direct monthly infrastructure cost reduction achieved by deploying NeuroLattice under the current inference workload.\n\nBy reducing memory bandwidth requirements at execution time, NeuroLattice lowers monthly inference spend from ${formatCurrency(costBase)} to ${formatCurrency(costNl)}, representing an ${(100 - (costNl / costBase * 100)).toFixed(0)}% cost reduction without changes to traffic volume or model behavior.`;
        
        const splitInterp1 = doc.splitTextToSize(interpret1, pageWidth - 28);
        doc.text(splitInterp1, 14, finalY);
        finalY += doc.getTextDimensions(splitInterp1).h + 10;

        // --- CHART 2: Cost Scenarios at Scale (Line Graph) ---
        // Basic check for remaining space on page 1
        if (finalY + 70 > 285) { 
             doc.addPage();
             finalY = 20;
        }

        doc.setFontSize(12);
        // @ts-ignore
        doc.setTextColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
        doc.setFont("helvetica", "bold");
        doc.text("2. Cost Scenarios at Scale", 14, finalY);
        finalY += 6;
        
        // Dynamically calculate scale points based on current traffic (RPM)
        // Creating a constant step size of 1x, 2x, 3x, 4x current traffic
        const scalePoints = [rpm, rpm * 2, rpm * 3, rpm * 4];
        const scaleLabels = scalePoints.map(p => formatNumber(p));
        
        // Unit costs (Monthly cost / Monthly requests)
        const unitCostBase = costBase / rpm;
        const unitCostNl = costNl / rpm;

        const scaleChartHeight = 32; // Hard reduction
        const chartWidth = 90;
        const startX = (pageWidth - chartWidth) / 2; // Centered
        const startY = finalY + scaleChartHeight + 5; // Bottom-left origin

        // Calculate Y values (Annualized)
        const dataBase = scalePoints.map(p => p * unitCostBase * 12);
        const dataNl = scalePoints.map(p => p * unitCostNl * 12);
        
        const maxVal = Math.max(...dataBase) * 1.1; // 10% headroom
        const xScale = chartWidth / (scalePoints.length - 1);
        const yScale = scaleChartHeight / maxVal;

        // --- Draw Axes ---
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        
        // Y-Axis Grid & Labels
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        for(let i=0; i<=5; i++) {
            const y = startY - (i * (scaleChartHeight / 5));
            const val = maxVal * (i / 5);
            doc.line(startX, y, startX + chartWidth, y); // Grid line
            doc.text(formatNumber(val), startX - 2, y + 1, { align: 'right' }); // Label
        }
        
        // --- Plot Lines ---
        const plotLine = (data: number[], color: [number, number, number]) => {
            // @ts-ignore
            doc.setDrawColor(color[0], color[1], color[2]);
            doc.setLineWidth(1.5);
            // @ts-ignore
            doc.setFillColor(color[0], color[1], color[2]);

            data.forEach((val, i) => {
                const x = startX + (i * xScale);
                const y = startY - (val * yScale);
                
                if (i > 0) {
                    const prevX = startX + ((i - 1) * xScale);
                    const prevY = startY - (data[i - 1] * yScale);
                    doc.line(prevX, prevY, x, y);
                }
                
                // Dot
                doc.circle(x, y, 1.5, 'F');
                
                // Value Label for last point
                if (i === data.length - 1) {
                    doc.text(formatCurrency(val), x, y - 4, { align: 'center' });
                }
            });
        };

        plotLine(dataBase, [239, 68, 68]); // Red (Baseline)
        // @ts-ignore
        plotLine(dataNl, BRAND_GREEN);   // Green (NeuroLattice)

        // --- X-Axis Labels ---
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        scaleLabels.forEach((label, i) => {
            const x = startX + (i * xScale);
            doc.text(label, x, startY + 5, { align: 'center' });
        });

        // --- Axis Titles ---
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100); 
        doc.setFont("helvetica", "bold");
        
        // X-Axis Title
        doc.text("Monthly Request Volume", startX + chartWidth / 2, startY + 9, { align: 'center' });
        
        // Y-Axis Title
        doc.text("Annual Cost ($)", startX - 13, startY - (scaleChartHeight / 2), { angle: 90, align: 'center' });
        
        // --- Legend ---
        const legendY = startY + 15;
        // Baseline Legend
        // @ts-ignore
        doc.setFillColor(239, 68, 68);
        doc.circle(startX + 10, legendY - 1, 2, 'F');
        doc.text("Baseline Cost", startX + 15, legendY);
        
        // NL Legend
        // @ts-ignore
        doc.setFillColor(BRAND_GREEN[0], BRAND_GREEN[1], BRAND_GREEN[2]);
        doc.circle(startX + 50, legendY - 1, 2, 'F');
        doc.text("With NeuroLattice", startX + 55, legendY);

        finalY = legendY + 10; // Move past chart and legend
        
        // --- INTERPRETATION 2: Scale ---
        doc.setFontSize(9);
        // @ts-ignore
        doc.setTextColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
        doc.setFont("helvetica", "bold");
        doc.text("Interpretation", 14, finalY);
        finalY += 4;

        doc.setFont("helvetica", "normal");
        // @ts-ignore
        doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);

        const interpret2 = "This chart demonstrates how inference costs scale with request volume under baseline execution versus NeuroLattice-optimized execution.\n\nWhile baseline costs increase linearly with traffic, NeuroLattice maintains a significantly lower cost curve by improving effective throughput per GPU. As inference volume grows, the absolute dollar savings increase proportionally.";
        const splitInterp2 = doc.splitTextToSize(interpret2, pageWidth - 28);
        doc.text(splitInterp2, 14, finalY);
        finalY += doc.getTextDimensions(splitInterp2).h + 4;

        // Takeaway
        // @ts-ignore
        doc.setTextColor(BRAND_GREEN[0], BRAND_GREEN[1], BRAND_GREEN[2]);
        doc.setFont("helvetica", "bold"); 
        const takeaway = "At higher traffic levels, NeuroLattice shifts inference economics from cost-scaling to capacity-scaling, enabling growth without proportional infrastructure expansion.";
        
        const splitTakeaway = doc.splitTextToSize(takeaway, pageWidth - 28);
        doc.text(splitTakeaway, 14, finalY);
        finalY += doc.getTextDimensions(splitTakeaway).h + 20;

        // --- Next Step: Architecture-Specific Cost Analysis ---
        // New Page optional? Check space.
        if (finalY + 60 > 280) {
            doc.addPage();
            finalY = 20;
        }

        doc.setFontSize(12);
        // @ts-ignore
        doc.setTextColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
        doc.setFont("helvetica", "bold");
        doc.text("Next Step: Architecture-Specific Cost Analysis", 14, finalY);
        
        finalY += 6;
        doc.setFontSize(9);
        // @ts-ignore
        doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);
        doc.setFont("helvetica", "normal");

        const nextStepText = [
            "For organizations operating production AI systems, the largest inefficiencies typically occur inside the execution graph itself — where redundant structure drives unnecessary memory traffic, energy use, and hardware over-provisioning."
        ];

        nextStepText.forEach(para => {
           const split = doc.splitTextToSize(para, pageWidth - 28);
           doc.text(split, 14, finalY);
           finalY += doc.getTextDimensions(split).h + 4;
        });

        doc.text("NeuroLattice offers an architecture-level analysis to identify:", 14, finalY);
        finalY += 5;

        const analysisPoints = [
            "Where memory bandwidth is the binding constraint",
            "Which components of the model drive disproportionate inference cost",
            "How much cost and capacity can be recovered through structural execution optimization"
        ];
        analysisPoints.forEach(pt => {
             doc.text(`• ${pt}`, 18, finalY); // Indented bullet
             finalY += 5;
        });
        
        finalY += 2;
        const closingText = "Teams can request a confidential deep-dive assessment to receive a model-specific breakdown of inference bottlenecks, cost drivers, and optimization pathways tailored to their environment.";
        const splitClosing = doc.splitTextToSize(closingText, pageWidth - 28);
        doc.text(splitClosing, 14, finalY);
        finalY += doc.getTextDimensions(splitClosing).h + 5;

        // CTA
        doc.setFont("helvetica", "bold");
        doc.text("To initiate a detailed architecture review, visit:", 14, finalY);
        // @ts-ignore
        doc.setTextColor(BRAND_GREEN[0], BRAND_GREEN[1], BRAND_GREEN[2]);
        doc.textWithLink("https://www.neuro-lattice.com/contact", 85, finalY, { url: "https://www.neuro-lattice.com/contact" });

         // --- Footer (All Pages) ---
        const pageCount = doc.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            // @ts-ignore
            doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
            doc.text(`Confidential — Prepared by NeuroLattice | Page ${i} of ${pageCount}`, 14, 285);
            doc.text("Estimates based on provided configuration. Actual results may vary.", pageWidth - 14, 285, { align: "right" });
        }

        doc.save('NeuroLattice_Executive_Report.pdf');
    });
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
                  type="text" 
                  value={trafficValue.toLocaleString()} 
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    const val = raw ? parseInt(raw, 10) : 0;
                    setTrafficValue(val);
                  }}
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                   Peak GPU Memory Utilization (MB)
                   <div className="tooltip-container" title={`Directly visible in:
• NVIDIA DCGM
• nvidia-smi
• Datadog / Prometheus
• Cloud provider GPU metrics`}>
                      <Info size={14} style={{ cursor: 'help', opacity: 0.7 }} />
                   </div>
                </label>
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
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

            <button onClick={handleGenerateReport} className="cta-box small">
              <span>Download Report</span>
            </button>
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
