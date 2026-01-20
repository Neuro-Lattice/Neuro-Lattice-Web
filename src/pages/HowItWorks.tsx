import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Layers, Target, Scissors, Zap, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './HowItWorks.css';

interface StepProps {
  id: number;
  title: string;
  icon: LucideIcon;
  conceptual: string;
  math: string;
  defaultOpen?: boolean;
}

const Step = ({ id, title, icon: Icon, conceptual, math, defaultOpen = false }: StepProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`process-step ${isOpen ? 'open' : ''}`}>
      <div className="step-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="step-icon-wrapper">
          <Icon size={24} className="step-icon" />
        </div>
        <div className="step-title-group">
          <span className="step-number">Step {id}</span>
          <h3 className="step-title">{title}</h3>
        </div>
        <ChevronDown size={20} className={`chevron ${isOpen ? 'rotate' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="step-content"
          >
            <div className="content-inner">
              <div className="conceptual">
                <h4>Conceptual</h4>
                <p>{conceptual}</p>
              </div>
              <div className="math glass">
                <h4>Technical Detail</h4>
                <p>{math}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: 'Dense Model Analysis',
      icon: Layers,
      conceptual: 'We start with your production-grade dense model, analyzing its internal activation flows and parameter importance.',
      math: 'Gradient-based sensitivity analysis across all layers to establish a performance baseline.',
      defaultOpen: true
    },
    {
      id: 2,
      title: 'Functional Mask Learning',
      icon: Target,
      conceptual: 'Instead of just pruning small weights, we learn a functional mask that identifies the critical subgraph required for the task.',
      math: 'L0-regularized optimization of a binary-stochastic mask over the model parameters.'
    },
    {
      id: 3,
      title: 'Geometry-Preserving Projection',
      icon: ShieldCheck,
      conceptual: 'We learn a projection that preserves feature geometry before removing channels — avoiding the instability seen in standard pruning.',
      math: 'Learn a mapping P such that || P(features_dense) - features_sparse || is minimized, preserving the latent representation manifold.'
    },
    {
      id: 4,
      title: 'Physical Pruning (Structural Commit)',
      icon: Scissors,
      conceptual: 'The "masked" model is physically restructured. Non-functional channels and neurons are removed, resulting in a smaller file size and faster execution.',
      math: 'Physical removal of rows/columns from weight tensors and re-initialization of batch-norm layers to match new dimensions.'
    },
    {
      id: 5,
      title: 'Stabilized Sparse Model',
      icon: Zap,
      conceptual: 'The resulting model is fine-tuned to regain any minor accuracy loss, resulting in a production-ready, highly efficient engine.',
      math: 'Knowledge distillation from the original dense model into the new restructured architecture to recover accuracy.'
    }
  ];

  return (
    <div className="how-it-works-page">
      <section className="section-padding">
        <div className="container">
          <div className="header-center">
            <h1 className="page-title">How It <span className="text-gradient">Works</span></h1>
            <p className="page-subtitle">Our structural restructuring pipeline moves beyond traditional pruning.</p>
          </div>

          <div className="process-flow">
            <div className="flow-line"></div>
            {steps.map((step) => (
              <Step key={step.id} {...step} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
