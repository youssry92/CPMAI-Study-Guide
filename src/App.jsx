
import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Brain,
  Target,
  ClipboardList,
  BarChart3,
  Bookmark,
  StickyNote,
  Search,
  Moon,
  Sun,
  RotateCcw,
  Timer,
  CheckCircle2,
  XCircle,
  Trophy,
  Flame,
  ShieldCheck,
  Rocket,
  Menu,
  X,
  Home
} from 'lucide-react';
import data from './data/cpmaiData.json';

const LS = {
  dark: 'cpmaiV3Dark',
  tab: 'cpmaiV3Tab',
  answers: 'cpmaiV3Answers',
  bookmarks: 'cpmaiV3Bookmarks',
  notes: 'cpmaiV3Notes',
  examAnswers: 'cpmaiV3ExamAnswers',
  currentExam: 'cpmaiV3CurrentExam',
  studyProgress: 'cpmaiV3StudyProgress',
  studyBookmarks: 'cpmaiV3StudyBookmarks',
  studyNotes: 'cpmaiV3StudyNotes'
};

const SOURCE_NOTE = 'Original study content synthesized from user-provided PMI-CPMAI workbook, sample workbook, PMI guide to leading/managing AI projects, and PMI AI in PPPM standard. This app does not reproduce PMI course text or official exam questions.';

const STUDY_BOOK = [
  {
    id: 'start',
    title: 'Start Here: How to Think Like PMI-CPMAI',
    badge: 'Orientation',
    color: '#2563eb',
    minutes: 35,
    summary: 'PMI-CPMAI is not about memorizing AI definitions. It is about managing AI initiatives so they deliver measurable business value, use the right data, remain trustworthy, and continue working after deployment.',
    objectives: [
      'Understand why AI projects fail when teams jump from idea to model without business, data, governance, and operational readiness.',
      'Learn the CPMAI mental model: business first, data second, model third, evaluation before deployment, and continuous monitoring after launch.',
      'Recognize PMI-style exam choices: the best answer usually improves clarity, evidence, governance, stakeholder alignment, or readiness before rushing forward.',
      'Separate AI-as-a-tool from AI-as-a-deliverable: using AI to help project work is different from managing a project that creates or operationalizes an AI system.'
    ],
    sections: [
      {
        title: 'The exam mindset',
        body: 'In scenario questions, assume the project manager is accountable for disciplined AI delivery, not for personally coding the model. The project manager should ask whether the AI use case is justified, whether the right data exists, whether governance and stakeholder expectations are clear, whether success metrics are measurable, and whether deployment can be monitored safely.',
        bullets: [
          'If the answer jumps straight to model training, be suspicious unless business and data readiness are already established.',
          'If the answer ignores ethics, privacy, compliance, bias, explainability, or human oversight, be suspicious.',
          'If the answer treats AI as deterministic software, be suspicious. AI is probabilistic and requires evaluation, thresholds, monitoring, and iteration.',
          'If the answer proposes a smaller MVP with clear KPIs and learning loops, it is often stronger than a broad transformation with vague value.'
        ]
      },
      {
        title: 'The CPMAI flow in one sentence',
        body: 'Start with the business problem and AI fit, verify the data, prepare the data, build or adapt the model, evaluate technical and business performance, then operationalize with monitoring, governance, versioning, and iteration.',
        bullets: [
          'Business Understanding: Why AI, why now, what value, what success criteria?',
          'Data Understanding: Do we have the right data, access, quality, and governance?',
          'Data Preparation: Can raw data become reliable AI-ready data?',
          'Model Development: Which build/buy/integrate approach best fits value, risk, capability, and constraints?',
          'Model Evaluation: Does the model meet technical metrics and business KPIs under realistic conditions?',
          'Operationalization: Can the AI system run, be monitored, be governed, be improved, and be stopped safely?'
        ]
      }
    ],
    traps: [
      'Treating CPMAI as a waterfall checklist instead of an iterative framework.',
      'Choosing AI because it is exciting rather than because it creates measurable value.',
      'Assuming better algorithms can fix poor data or unclear objectives.',
      'Forgetting that deployment starts a monitoring life cycle rather than ending the project.'
    ],
    checklist: [
      'Can I explain all six CPMAI phases in order and why they are iterative?',
      'Can I identify when a scenario requires returning to an earlier phase?',
      'Can I distinguish business KPI, model metric, technology KPI, and governance requirement?',
      'Can I explain why trustworthy AI must be embedded from Phase I onward?'
    ],
    quiz: [
      {
        q: 'A sponsor asks the team to build an AI chatbot immediately because competitors are using AI. What is the best first response?',
        a: 'Clarify the business problem, success criteria, AI fit, stakeholder expectations, risks, and feasibility before selecting or building a model.'
      },
      {
        q: 'A model has high lab accuracy but business users reject it because it disrupts workflow. Which CPMAI lesson applies?',
        a: 'Technical performance alone is insufficient. Evaluation must validate business value, stakeholder acceptance, process integration, and operational readiness.'
      }
    ]
  },
  {
    id: 'foundations',
    title: 'CPMAI Foundations and AI Literacy',
    badge: 'Foundation',
    color: '#7c3aed',
    minutes: 70,
    summary: 'This chapter builds the minimum AI literacy needed for the exam: AI systems infer outputs from inputs; ML learns patterns from data; GenAI creates content; and AI projects require human oversight, clear vocabulary, and realistic expectations.',
    objectives: [
      'Define AI, AI system, ML, deep learning, NLP, computer vision, GenAI, LLMs, foundation models, expert systems, and rule-based systems at a practical project-management level.',
      'Understand why shared vocabulary reduces confusion across business, technical, legal, and governance stakeholders.',
      'Distinguish automation from AI using perception, prediction, and planning.',
      'Recognize why human-in-the-loop is both a safeguard and a source of value.'
    ],
    sections: [
      {
        title: 'AI as a system, not magic',
        body: 'An AI system is machine-based and generates predictions, recommendations, content, or decisions from input data. Different systems vary in autonomy and adaptiveness. For project managers, the important point is not the mathematical internals but the management consequences: data matters, uncertainty matters, oversight matters, and outcomes must be validated.',
        bullets: [
          'ML models learn patterns from data and improve through training or additional experience.',
          'Deep learning uses multilayer neural networks for complex patterns such as images, text, speech, and multimodal data.',
          'GenAI produces new content and therefore requires content-quality controls, hallucination mitigation, IP awareness, and human review where needed.',
          'Rule-based systems follow fixed logic; AI systems infer, adapt, or generalize beyond explicit rules.'
        ]
      },
      {
        title: 'Automation versus AI',
        body: 'Automation is best for predictable repeatable workflows. AI is needed when the system must handle variability through perception, prediction, or planning. If humans perceive, predict, and plan while the machine only executes, the intelligence is human, not AI. This distinction helps avoid unnecessary AI projects.',
        bullets: [
          'Perception: interpreting unstructured or variable inputs such as text, audio, images, or complex patterns.',
          'Prediction: forecasting outcomes or inferring likely scenarios from incomplete information.',
          'Planning: sequencing actions dynamically to meet objectives under changing conditions.',
          'Exam clue: If a simple workflow or rule engine is enough, do not choose AI just because AI is available.'
        ]
      },
      {
        title: 'Human-in-the-loop',
        body: 'Human-in-the-loop means humans review, validate, intervene, or override AI outputs when risk, ambiguity, ethics, context, or accountability requires human judgment. It is not just a control; it brings stakeholder context, ethical judgment, creativity, and institutional knowledge into AI-enabled decisions.',
        bullets: [
          'Define intervention triggers before deployment.',
          'Create escalation paths for low confidence, high impact, or sensitive decisions.',
          'Train reviewers to understand AI limitations and evaluate outputs critically.',
          'Log human interventions so the system can improve and remain auditable.'
        ]
      }
    ],
    traps: [
      'Calling every automation AI.',
      'Trusting AI outputs without validation because the model appears sophisticated.',
      'Assuming technical users and business stakeholders use AI terms the same way.',
      'Removing human oversight from high-risk decisions too early.'
    ],
    checklist: [
      'Can I explain AI as tool versus AI as deliverable?',
      'Can I decide whether a use case needs automation, AI, or both?',
      'Can I explain HITL triggers and why they matter?',
      'Can I describe GenAI-specific risks such as hallucination, content quality, privacy, IP, and prompt injection?'
    ],
    quiz: [
      { q: 'A workflow follows fixed approval rules with no learning, prediction, or perception. Is this AI?', a: 'No. It is automation unless intelligent capabilities such as perception, prediction, or planning are used.' },
      { q: 'Why does GenAI require special operational controls?', a: 'Generated outputs can vary, hallucinate, conflict with brand or policy, expose sensitive data, or create IP/compliance concerns.' }
    ]
  },
  {
    id: 'patterns',
    title: 'The Seven Patterns of AI',
    badge: 'Patterns',
    color: '#0891b2',
    minutes: 80,
    summary: 'The Seven Patterns organize AI use cases so project managers can anticipate data needs, risks, stakeholders, metrics, timelines, and build/buy decisions.',
    objectives: [
      'Identify the seven common AI patterns and the management implications of each.',
      'Connect business problems to likely AI patterns before choosing technology.',
      'Recognize when projects combine multiple patterns and require scope control.',
      'Use patterns to anticipate data, team, risk, validation, and operational needs.'
    ],
    sections: [
      {
        title: '1. Conversational and Human Interaction',
        body: 'Systems interact naturally with people through text, voice, or multimodal interfaces. These projects require conversation design, NLP, knowledge integration, backend system access, escalation flows, privacy controls, and user satisfaction metrics.',
        bullets: ['Examples: chatbot, virtual assistant, voice interface, support bot.', 'Key metrics: resolution rate, escalation rate, user satisfaction, response quality, latency.', 'Key risks: hallucination, privacy exposure, poor handoff, inconsistent tone, inadequate domain grounding.']
      },
      {
        title: '2. Recognition',
        body: 'Systems classify or detect objects, speech, documents, images, video, or other unstructured content. Recognition work is data-labeling intensive and needs robust validation against real-world variation.',
        bullets: ['Examples: document extraction, image inspection, speech recognition, medical imaging.', 'Key metrics: accuracy, precision, recall, F1, false positive/negative rates.', 'Key risks: biased labels, poor representativeness, edge cases, privacy and surveillance concerns.']
      },
      {
        title: '3. Predictive Analytics and Decision Support',
        body: 'Systems forecast likely outcomes or support human decisions. These projects require clear prediction targets, historical data, explainability, decision rules, and ROI linkage.',
        bullets: ['Examples: churn prediction, demand forecasting, fraud risk, project cost prediction.', 'Key metrics: prediction error, ROC AUC, calibration, business impact.', 'Key risks: drift, spurious correlations, overreliance, unexplained predictions.']
      },
      {
        title: '4. Goal-Driven Systems',
        body: 'Systems optimize toward goals, often using reinforcement learning or optimization. They require clear objectives, constraints, simulations, safety boundaries, and trade-off management.',
        bullets: ['Examples: dynamic resource optimization, bidding, routing, scheduling.', 'Key metrics: objective achievement, constraint violations, reward stability, cost of exploration.', 'Key risks: optimizing the wrong goal, unsafe exploration, unintended behaviors.']
      },
      {
        title: '5. Hyper-Personalization',
        body: 'Systems tailor experiences to individuals rather than broad segments. These projects require personal data governance, consent, real-time pipelines, testing, cold-start strategies, and fairness controls.',
        bullets: ['Examples: recommendations, personalized learning, next-best action.', 'Key metrics: conversion, retention, engagement, satisfaction, fairness across groups.', 'Key risks: privacy, filter bubbles, biased targeting, over-personalization.']
      },
      {
        title: '6. Autonomous Systems',
        body: 'Systems act independently in physical or digital environments. They require safety validation, fail-safes, regulatory awareness, liability planning, phased rollout, and strong monitoring.',
        bullets: ['Examples: autonomous vehicles, drones, autonomous IT operations, trading bots.', 'Key metrics: safety incidents, task success, intervention rate, uptime.', 'Key risks: harm, unclear accountability, emergent behavior, regulatory restrictions.']
      },
      {
        title: '7. Patterns and Anomalies',
        body: 'Systems detect unusual patterns or outliers. They often rely on large volumes of normal data and need domain experts to judge whether anomalies are meaningful.',
        bullets: ['Examples: cybersecurity anomaly detection, fraud alerts, quality defects.', 'Key metrics: false positive rate, detection rate, alert fatigue, domain expert confirmation.', 'Key risks: rare event validation, threshold tuning, drift in what counts as normal.']
      }
    ],
    traps: [
      'Selecting technology before identifying the AI pattern.',
      'Ignoring that multipattern solutions increase complexity and risk.',
      'Using the same metric for all patterns.',
      'Assuming a pretrained model is equally suitable across all patterns.'
    ],
    checklist: ['Can I map a scenario to one or more patterns?', 'Can I name the data needs and risks for each pattern?', 'Can I recommend starting with one pattern before expanding?', 'Can I identify pattern-specific metrics?'],
    quiz: [
      { q: 'A system flags abnormal payment behavior. Which pattern is most likely?', a: 'Patterns and Anomalies, possibly combined with Predictive Analytics and Decision Support.' },
      { q: 'A customer-service platform answers questions and personalizes product suggestions. What pattern issue exists?', a: 'It is multipattern: Conversational plus Hyper-Personalization, requiring scope control and data/privacy governance.' }
    ]
  },
  {
    id: 'phase1',
    title: 'Phase I: Business Understanding',
    badge: 'CPMAI Phase I',
    color: '#dc2626',
    minutes: 120,
    summary: 'Phase I determines whether the AI initiative is worth doing, what value it should deliver, what success means, whether AI is justified, what pattern applies, what constraints exist, and whether business/data/execution feasibility supports moving forward.',
    objectives: [
      'Define business objectives, business success criteria, AI success criteria, cost-benefit, ROI, and MVP scope.',
      'Evaluate whether AI is needed or whether non-AI alternatives are sufficient.',
      'Identify AI patterns and cognitive versus noncognitive components.',
      'Establish trustworthy AI requirements, human oversight, transparency, explainability, compliance, failure modes, and AI Go/No-Go.'
    ],
    sections: [
      { title: 'Business objectives and success criteria', body: 'Start by defining the real business problem in measurable terms. A weak objective says “use AI for service.” A strong objective says “reduce routine customer inquiry response time from 24 hours to under 5 minutes while maintaining satisfaction and safe escalation.”', bullets: ['Capture background and current pain points.', 'Define measurable business success criteria.', 'Define AI success criteria that prove AI adds value beyond non-AI options.', 'Define business KPIs and technical metrics before model development.'] },
      { title: 'AI fit and non-AI alternatives', body: 'CPMAI emphasizes not every problem should become an AI project. Compare AI to process improvement, rules, automation, reporting, or additional staffing. AI is justified when perception, prediction, planning, learning, or handling variability creates meaningful value beyond simpler approaches.', bullets: ['Identify the heuristic or non-AI baseline.', 'Explain why simpler alternatives are insufficient or good enough.', 'Define cognitive objectives in concrete terms.', 'Identify noncognitive components such as UI, APIs, databases, training, and support processes.'] },
      { title: 'AI Go/No-Go', body: 'The Go/No-Go decision prevents teams from spending heavily on projects that lack a clear business problem, usable data, organizational commitment, skills, technology, ROI, or deployment feasibility.', bullets: ['Business feasibility: clear problem, willingness to invest/change, sufficient ROI or impact.', 'Data feasibility: data measures what matters, enough data and access, sufficient quality.', 'Execution feasibility: technology and skills, timely execution, sensible operationalization location and mode.', 'Use green/yellow/red thinking: proceed, proceed with mitigation, or stop and fix.'] },
      { title: 'Trustworthy AI requirements', body: 'Trustworthy AI begins in Phase I. Teams identify ethics, responsibility, transparency, governance, explainability, compliance, bias, privacy, human-in-the-loop, and failure-contingency needs before design choices lock in risk.', bullets: ['Define potential harms and mitigation approaches.', 'Identify regulations, policies, consent, and data restrictions.', 'Determine transparency for data sources and data-selection methods.', 'Set explainability requirements based on stakeholder and regulatory needs.', 'Define model failure modes, confidence thresholds, fallback options, and escalation.'] }
    ],
    traps: ['Starting data collection or modeling before success criteria are defined.', 'Ignoring the current non-AI baseline.', 'Treating Go/No-Go as paperwork instead of a real decision gate.', 'Proceeding with “maybe” items without owners, mitigations, and deadlines.'],
    checklist: ['Problem statement is measurable.', 'AI fit is justified against non-AI alternatives.', 'Business, data, and execution feasibility are assessed.', 'ROI and MVP scope are realistic.', 'Trustworthy AI requirements are documented.'],
    quiz: [
      { q: 'A project has unclear ROI but excellent model possibilities. What should happen?', a: 'Stay in or return to Business Understanding. Clarify value, business KPIs, feasibility, and stakeholder commitment before model development.' },
      { q: 'Which is stronger: “Use AI to improve support” or “Reduce routine support wait time from 24 hours to under 5 minutes”?', a: 'The second, because it is measurable and can connect to business KPIs and AI success criteria.' }
    ]
  },
  {
    id: 'phase2',
    title: 'Phase II: Data Understanding',
    badge: 'CPMAI Phase II',
    color: '#ea580c',
    minutes: 105,
    summary: 'Phase II determines whether the right data exists, can be accessed, is legally and ethically usable, has sufficient quality and representativeness, and fits the chosen AI pattern.',
    objectives: ['Inventory and collect initial data.', 'Describe data format, quantity, structure, sources, and limitations.', 'Explore data for patterns, gaps, sufficiency, and bias.', 'Verify data quality and define training, validation, test, edge, and pretrained model data needs.'],
    sections: [
      { title: 'Data inventory and access', body: 'AI cannot learn what the data does not contain. Teams list required data sources, owners, locations, formats, access constraints, consent restrictions, and collection issues. Access and rights matter as much as technical availability.', bullets: ['Document data locations and acquisition methods.', 'Confirm legal, policy, privacy, and security permissions.', 'Record access problems and resolutions for repeatability.', 'Identify source systems, APIs, files, warehouses, and external sources.'] },
      { title: 'Data description and exploration', body: 'Data description tells the team what exists. Data exploration tells the team what the data actually looks like. Exploration may reveal missing fields, skewed distributions, insufficient coverage, language issues, time gaps, or patterns that change the project plan.', bullets: ['Describe records, fields, formats, volumes, labels, and structure.', 'Assess structured, semi-structured, and unstructured data availability.', 'Explore distributions, subpopulations, relationships, and anomalies.', 'Check whether data aligns to the selected AI pattern.'] },
      { title: 'Data quality and trustworthy data', body: 'Data quality includes accuracy, completeness, consistency, timeliness, validity, relevance, representativeness, and context. Trustworthy data also requires lineage, consent, privacy, bias analysis, and governance.', bullets: ['Identify missing values, errors, duplicates, noise, and inconsistent formats.', 'Assess representativeness and bias risks.', 'Confirm data lineage and ownership.', 'Define preparation needs: cleaning, transformation, labeling, augmentation, anonymization.'] },
      { title: 'Training, validation, test, edge, and pretrained model data needs', body: 'The team defines how data will support model development. This includes splitting data, cross-validation, labeling requirements, edge constraints, and whether pretrained/foundation/third-party models can be tested or adapted with current data.', bullets: ['Define training, validation, and test strategy.', 'Check labeling needs and label quality controls.', 'Assess edge data constraints if deployment is on limited devices.', 'Evaluate pretrained or third-party model assumptions, data origin, performance, cost, and monitoring.'] }
    ],
    traps: ['Assuming data exists because a business system exists.', 'Ignoring usage rights, consent, or data residency.', 'Confusing data quantity with data usefulness.', 'Moving to preparation before understanding data limitations.'],
    checklist: ['Data inventory complete.', 'Access and rights confirmed.', 'Quality issues documented.', 'Bias and representativeness assessed.', 'Data split and labeling strategy planned.'],
    quiz: [{ q: 'Can a model fix data that does not measure the required business outcome?', a: 'No. If data does not measure what matters, the team should revisit data feasibility and possibly the business objective or data strategy.' }]
  },
  {
    id: 'phase3',
    title: 'Phase III: Data Preparation',
    badge: 'CPMAI Phase III',
    color: '#ca8a04',
    minutes: 110,
    summary: 'Phase III converts raw data into AI-ready data through selection, cleaning, integration, transformation, labeling, augmentation, anonymization, versioning, and repeatable pipelines.',
    objectives: ['Select data and document inclusion/exclusion rationale.', 'Clean, normalize, anonymize, denoise, and transform data.', 'Enhance and augment data responsibly.', 'Build repeatable preparation pipelines with governance and quality controls.'],
    sections: [
      { title: 'Data selection', body: 'Select rows, columns, files, records, time windows, languages, or segments based on relevance, quality, constraints, and the AI objective. Document exclusions because excluded data can later explain bias, limitations, or performance gaps.', bullets: ['Select relevant data sources and attributes.', 'Exclude low-quality, irrelevant, unauthorized, duplicate, or out-of-scope data.', 'Record rationale for inclusion/exclusion.', 'Keep selection traceable for audits and future iterations.'] },
      { title: 'Data cleaning and transformation', body: 'Preparation includes deduplication, missing-value treatment, error correction, syntax fixes, normalization, denoising, format conversion, anonymization, and feature engineering. For AI, preparation shapes what the model learns.', bullets: ['Create training and inference pipelines.', 'Normalize values and standardize formats.', 'Remove or treat duplicates, outliers, and noise.', 'Anonymize or de-identify sensitive data when required.', 'Preserve business meaning while transforming data into model-ready form.'] },
      { title: 'Enhancement, augmentation, and labeling', body: 'Enhancement creates derived attributes or merges additional context. Augmentation creates additional examples where appropriate. Labeling creates supervised learning targets and must be quality-controlled.', bullets: ['Create derived attributes that represent business patterns.', 'Merge data sources carefully and document joins.', 'Use augmentation cautiously and validate synthetic or expanded data.', 'Define labeling methods, costs, reviewers, quality thresholds, and dispute resolution.'] },
      { title: 'Data governance in preparation', body: 'Preparation should not weaken privacy, fairness, lineage, or compliance. Version prepared datasets, monitor preparation quality, and make pipelines reproducible so model results can be explained and audited.', bullets: ['Track data lineage from raw source to training set.', 'Version datasets and transformations.', 'Implement quality gates and automated checks.', 'Balance model performance with explainability and privacy requirements.'] }
    ],
    traps: ['Treating data preparation as a technical cleanup task only.', 'Failing to document transformations.', 'Using synthetic or augmented data without validation.', 'Preparing training data differently from production inference data.'],
    checklist: ['Selection rationale documented.', 'Cleaning and transformation pipeline reproducible.', 'Labeling quality controlled.', 'Privacy and bias mitigations applied.', 'Prepared dataset ready for model development.'],
    quiz: [{ q: 'Why is it dangerous if production data is prepared differently from training data?', a: 'The model may receive inputs that differ from what it learned, causing degraded or unpredictable performance.' }]
  },
  {
    id: 'phase4',
    title: 'Phase IV: Model Development',
    badge: 'CPMAI Phase IV',
    color: '#16a34a',
    minutes: 120,
    summary: 'Phase IV turns prepared data and business requirements into model candidates through build/buy/integrate decisions, algorithm selection, training, fine-tuning, prompt engineering, AutoML, ensembles, validation design, and hyperparameter optimization.',
    objectives: ['Select model technique based on AI pattern, data, business value, constraints, and trust requirements.', 'Decide whether to build, buy, integrate, use pretrained models, fine-tune, or use GenAI/RAG.', 'Design test and validation strategy.', 'Train, tune, document, and compare models.'],
    sections: [
      { title: 'Build, buy, or integrate', body: 'Model development begins with a strategic choice. Build gives control and proprietary advantage but needs expertise and resources. Buy or use APIs speeds delivery but introduces vendor, privacy, explainability, and lock-in considerations. Integration often combines models, systems, and workflows.', bullets: ['Build when unique data, IP, control, or compliance requires custom capability.', 'Buy/use pretrained models when the pattern is common, speed matters, and provider controls are acceptable.', 'Integrate when value comes from connecting AI capability with existing systems and workflows.', 'Always evaluate privacy, cost, explainability, performance, and operational fit.'] },
      { title: 'Algorithm/model selection and assumptions', body: 'Select techniques that fit the problem domain: classification, regression, clustering, content generation, optimization, recognition, or conversational systems. Document assumptions because invalid assumptions become future failure points.', bullets: ['Classification: accuracy, precision, recall, F1, ROC AUC, confusion matrix.', 'Regression: MAE, MSE, RMSE, R-squared.', 'Clustering: silhouette, Davies-Bouldin, Calinski-Harabasz, business usefulness.', 'GenAI/NLP: quality, factuality, relevance, safety, consistency, BLEU/ROUGE/BERTScore where appropriate, and human evaluation.'] },
      { title: 'Fine-tuning, prompt engineering, RAG, and agents', body: 'Modern projects may adapt foundation models using fine-tuning, prompt engineering, retrieval-augmented generation, chaining, or agents. These require quality standards, knowledge-base governance, prompt/version management, safety controls, and cost monitoring.', bullets: ['Prompt templates should be tested and versioned.', 'RAG requires trusted knowledge bases, chunking, metadata, embeddings, retrieval tuning, and source validation.', 'Agents require tool permissions, boundaries, audit logs, circuit breakers, and human oversight.', 'GenAI outputs require hallucination mitigation and content governance.'] },
      { title: 'Validation design and hyperparameter optimization', body: 'Before trusting a model, define how it will be tested. Use train/validation/test splits, cross-validation, baselines, learning curves, and business-aligned thresholds. Tune hyperparameters systematically and avoid overfitting.', bullets: ['Separate training, validation, and test data.', 'Use cross-validation where appropriate.', 'Track experiments and settings.', 'Compare against simple baselines.', 'Use early stopping, regularization, and validation metrics to detect overfitting or underfitting.'] }
    ],
    traps: ['Choosing the most advanced model instead of the most appropriate model.', 'Ignoring provider risks for third-party models.', 'Treating prompt engineering as ad hoc wording instead of a governed development activity.', 'Optimizing model metrics while ignoring business KPIs.'],
    checklist: ['Build/buy/integrate rationale documented.', 'Model assumptions known.', 'Validation design ready.', 'Trustworthy AI controls included in development.', 'Experiments and hyperparameters tracked.'],
    quiz: [{ q: 'A pretrained model is fast and cheap but its training data origin is unclear. What should the team do?', a: 'Assess data origin, privacy, bias, performance, explainability, vendor terms, and compliance before adopting it.' }]
  },
  {
    id: 'phase5',
    title: 'Phase V: Model Evaluation',
    badge: 'CPMAI Phase V',
    color: '#059669',
    minutes: 100,
    summary: 'Phase V validates whether the model is technically sound, business-aligned, trustworthy, operationally ready, accepted by stakeholders, and safe to move toward production.',
    objectives: ['Evaluate technical metrics and business KPIs together.', 'Validate model performance under realistic and edge conditions.', 'Review bias, ethics, compliance, explainability, privacy, and security.', 'Decide whether to deploy, iterate, or stop.'],
    sections: [
      { title: 'Technical evaluation', body: 'Evaluate the model using metrics appropriate to the problem domain and AI pattern. Classification, regression, clustering, GenAI, and agentic systems need different measures. Technical results should be stable across relevant segments and conditions.', bullets: ['Use confusion matrices, ROC curves, precision/recall, F1, or error metrics as appropriate.', 'Test edge cases and distribution shifts.', 'Check overfitting and underfitting.', 'Validate robustness, latency, throughput, and resource usage.'] },
      { title: 'Business KPI evaluation', body: 'A model that performs well technically but fails business KPIs is not ready. Compare results against Phase I success criteria, ROI assumptions, workflow impact, adoption, and stakeholder satisfaction.', bullets: ['Measure cost savings, cycle-time reduction, revenue uplift, risk reduction, or service improvement.', 'Validate business process integration through pilots or user acceptance testing.', 'Compare with baseline/current process.', 'Identify whether shortfalls require changes to data, model, process, or scope.'] },
      { title: 'Trustworthy AI validation', body: 'Before production, test the trust mechanisms: fairness, bias, privacy, explainability, transparency, accountability, auditability, escalation, and human oversight. This is where requirements defined earlier are proven.', bullets: ['Fairness testing across relevant populations or segments.', 'Privacy and compliance validation.', 'Explanation quality testing for intended users.', 'Audit trail and accountability mechanism verification.', 'Human override and escalation testing.'] },
      { title: 'Iteration decision', body: 'Evaluation produces a decision: proceed to operationalization, iterate on earlier phases, change the model, change data, adjust business scope, or stop. CPMAI expects iteration when evidence shows gaps.', bullets: ['Return to Phase II if data is inadequate.', 'Return to Phase III if preparation caused issues.', 'Return to Phase IV if model approach needs change.', 'Return to Phase I if business assumptions or success criteria are no longer valid.'] }
    ],
    traps: ['Approving deployment based only on lab accuracy.', 'Ignoring stakeholder acceptance.', 'Skipping bias or compliance checks because the model metric is strong.', 'Treating iteration as failure rather than normal CPMAI behavior.'],
    checklist: ['Technical metrics meet thresholds.', 'Business KPIs validated.', 'Trustworthy AI requirements tested.', 'Operational readiness assessed.', 'Iteration decision documented.'],
    quiz: [{ q: 'A fraud model has high accuracy but misses costly fraud cases. Which metric concern is likely?', a: 'Recall/false negatives may be unacceptable even if overall accuracy is high.' }]
  },
  {
    id: 'phase6',
    title: 'Phase VI: Model Operationalization',
    badge: 'CPMAI Phase VI',
    color: '#0f766e',
    minutes: 120,
    summary: 'Phase VI deploys the AI system into real use and establishes monitoring, versioning, governance, maintenance, retraining, rollback, contingency, and next-iteration mechanisms.',
    objectives: ['Plan deployment mode and environment.', 'Integrate model with non-AI systems and business workflows.', 'Monitor technical performance, business value, drift, bias, compliance, and cost.', 'Establish governance ownership and next-iteration learning.'],
    sections: [
      { title: 'Deployment strategy', body: 'Operationalization may be batch, real-time, streaming, API, microservice, embedded, cloud, on-premises, edge, hybrid, or report-based. Choose based on security, latency, data residency, cost, scalability, integration, and AI pattern needs.', bullets: ['Cloud: scalable and flexible but requires vendor, privacy, and cost governance.', 'On-premises: more control but higher infrastructure responsibility.', 'Edge: lower latency and local processing but constrained compute and harder monitoring.', 'Hybrid: balances security, scalability, and integration trade-offs.'] },
      { title: 'Model scaffolding and non-AI work', body: 'AI value often depends on non-AI components: UI, APIs, databases, authentication, dashboards, training, support, documentation, workflow redesign, and change management. Operationalization can require additional user stories or sprints.', bullets: ['Build secure APIs and integrations.', 'Create interfaces and user workflows.', 'Train users and support teams.', 'Set up logging, dashboards, alerts, and documentation.', 'Plan staged rollout, rollback, and failover.'] },
      { title: 'Monitoring and maintenance', body: 'Production AI can degrade as data, users, business rules, and environments change. Monitoring should cover model metrics, data drift, performance, cost, user satisfaction, business KPIs, compliance, bias, security, and uptime.', bullets: ['Detect model drift and data drift.', 'Track latency, throughput, error rates, and resource use.', 'Monitor business KPIs and ROI.', 'Implement retraining and approval pipelines.', 'Maintain version control for model, data, prompt, and configuration.'] },
      { title: 'Governance and next iteration', body: 'Operational AI needs named owners, escalation paths, audit trails, review cadence, decision rights, and improvement planning. Phase VI produces learning that feeds the next CPMAI cycle.', bullets: ['Define model owner, data owner, system owner, business owner, and governance committee.', 'Log decisions, exceptions, and human interventions.', 'Run post-implementation review and capture lessons learned.', 'Identify next iteration: improve, scale, expand patterns, retire, or replace.'] }
    ],
    traps: ['Assuming deployment is the end of the project.', 'Deploying without monitoring and rollback.', 'Ignoring non-AI workflow and adoption work.', 'No named owner for model governance after go-live.'],
    checklist: ['Deployment environment selected.', 'Monitoring and alerts configured.', 'Retraining/versioning process defined.', 'Governance ownership assigned.', 'Contingency and rollback plan ready.'],
    quiz: [{ q: 'A deployed model loses accuracy after customer behavior changes. What CPMAI concept applies?', a: 'Continuous monitoring should detect drift and trigger investigation, retraining, adjustment, or rollback.' }]
  },
  {
    id: 'trustworthy',
    title: 'Trustworthy AI Deep Dive',
    badge: 'Trust',
    color: '#4f46e5',
    minutes: 95,
    summary: 'Trustworthy AI is built through ethical AI, responsible AI, transparent AI, governed AI, and explainable AI across all CPMAI phases.',
    objectives: ['Understand the five layers of trustworthy AI.', 'Know how each CPMAI phase supports trust.', 'Apply bias, privacy, transparency, explainability, accountability, and governance checks.', 'Recognize exam traps where trust is treated as an afterthought.'],
    sections: [
      { title: 'Ethical AI', body: 'Ethical AI asks whether the system respects human values, avoids harm, supports fairness, and accounts for impacted stakeholders. Ethical requirements should influence use-case selection, data choices, model design, evaluation, and deployment.', bullets: ['Identify potential physical, financial, emotional, environmental, or social harms.', 'Evaluate fairness and bias risks.', 'Engage impacted stakeholders early.', 'Create mitigation and escalation plans.'] },
      { title: 'Responsible AI', body: 'Responsible AI assigns accountability. Someone must own outcomes, monitor system behavior, respond to incidents, and maintain human authority over important decisions.', bullets: ['Define roles and decision rights.', 'Document approvals and oversight.', 'Create escalation paths and human review triggers.', 'Maintain audit trails and accountability records.'] },
      { title: 'Transparent and Explainable AI', body: 'Transparency explains what data, methods, and processes are used. Explainability helps stakeholders understand why outputs occur. Different audiences need different explanation levels.', bullets: ['Document data sources and selection methods.', 'Communicate model capabilities and limitations.', 'Use explainability tools where needed.', 'Validate that explanations are understandable and useful.'] },
      { title: 'Governed AI', body: 'Governed AI connects AI work to organizational policies, regulatory requirements, compliance checks, risk management, standards, and ongoing monitoring.', bullets: ['Integrate AI governance into existing GRC structures.', 'Create review checkpoints and audit schedules.', 'Monitor compliance after deployment.', 'Update controls as technology and regulations evolve.'] }
    ],
    traps: ['Checking ethics only at the end.', 'Assuming black-box models are acceptable for all use cases.', 'No data lineage or audit trail.', 'No clear owner for AI decisions.'],
    checklist: ['Ethical risks identified.', 'Responsible owners assigned.', 'Transparency documented.', 'Explainability requirements met.', 'Governance and compliance monitoring planned.'],
    quiz: [{ q: 'Which is better: add explainability after deployment or define explainability needs in Phase I?', a: 'Define explainability needs in Phase I so model and architecture choices can support them.' }]
  },
  {
    id: 'genai-agentic',
    title: 'GenAI, RAG, Agents, and Agentic AI',
    badge: 'Advanced',
    color: '#9333ea',
    minutes: 100,
    summary: 'GenAI and agents add content variability, hallucination risk, tool access, autonomous action, coordination, emergent behavior, and new governance needs. CPMAI manages them through the same six-phase discipline with stronger controls.',
    objectives: ['Apply CPMAI to GenAI projects.', 'Understand RAG, prompts, knowledge bases, and output controls.', 'Apply CPMAI to agentic AI and autonomous workflow intelligence.', 'Define safety boundaries, circuit breakers, audit trails, and human oversight.'],
    sections: [
      { title: 'GenAI through CPMAI', body: 'In Phase I, define content use case, quality standards, human review, IP, privacy, and success metrics. Phase II/III prepare knowledge bases, prompt examples, training data, and governance. Phase IV builds prompts, fine-tunes, or designs RAG. Phase V validates quality, hallucination, safety, bias, and business value. Phase VI monitors output quality, costs, prompts, knowledge base freshness, and compliance.', bullets: ['Define acceptable content variability.', 'Use RAG to ground outputs in trusted sources when appropriate.', 'Version prompts and knowledge bases.', 'Monitor hallucinations, safety, user satisfaction, and token/API cost.'] },
      { title: 'Agentic AI through CPMAI', body: 'Agentic AI requires decision boundaries, coordination protocols, tool permissions, safety mechanisms, and system-level monitoring. The project manager should ensure agents operate within approved authority and can be observed, stopped, or overridden.', bullets: ['Create decision-authority matrix.', 'Define tool permissions and access controls.', 'Implement circuit breakers and rollback.', 'Monitor individual agents and system-level emergent behavior.', 'Maintain audit logs of actions, data sources, and reasoning traces where appropriate.'] }
    ],
    traps: ['Letting agents act without decision boundaries.', 'No prompt or knowledge-base versioning.', 'No hallucination testing.', 'Ignoring cost and latency of GenAI operations.'],
    checklist: ['GenAI quality standards defined.', 'RAG/knowledge base governed.', 'Agent authority boundaries documented.', 'Circuit breakers and human override planned.', 'Operational monitoring includes content quality and cost.'],
    quiz: [{ q: 'An AI agent can approve refunds autonomously. What must be defined first?', a: 'Decision authority, limits, escalation triggers, audit trails, monitoring, and human override/circuit breakers.' }]
  },
  {
    id: 'pppm-standard',
    title: 'AI in Portfolio, Program, and Project Management',
    badge: 'PMI Standard',
    color: '#64748b',
    minutes: 90,
    summary: 'PMI AI guidance for PPPM adds principles and performance domains that strengthen CPMAI: strategic value, risk, governance, people/culture, ethics, stakeholder engagement, optimization/innovation, and data quality.',
    objectives: ['Understand the eight AI principles in PPPM.', 'Understand the five AI performance domains.', 'Connect PPPM AI principles to CPMAI exam scenarios.', 'Recognize portfolio/program/project level stakeholders and governance needs.'],
    sections: [
      { title: 'Eight principles', body: 'AI in PPPM should be guided by strategic value, risk, governance and compliance, people and culture, ethics and professional responsibility, stakeholder engagement, optimization and innovation, and data quality.', bullets: ['Strategic value: AI must align to goals and measurable outcomes.', 'Risk: manage bias, privacy, cybersecurity, uncertainty, and HITL.', 'Governance/compliance: define roles, policies, metrics, audits, and controls.', 'People/culture: train, empower, and manage change.', 'Ethics: fairness, transparency, accountability, privacy, data integrity.', 'Stakeholder engagement: communicate, align, and manage concerns.', 'Optimization/innovation: improve continuously with human-AI collaboration.', 'Data quality: accuracy, completeness, consistency, timeliness, validity, and context.'] },
      { title: 'Five performance domains', body: 'The standard frames AI work through managing stakeholder expectations, defining scope for AI, designing AI architecture with quality and reliability, executing strategic AI goals, and managing AI risks and uncertainties.', bullets: ['Stakeholder expectations: identify, analyze, engage, monitor, and adapt.', 'Scope for AI: define vision, mission, value propositions, risks, and change management.', 'Architecture: infrastructure, data, models, quality, reliability, security, privacy, monitoring.', 'Strategic execution: align portfolios, programs, projects, resources, and governance.', 'Risk/uncertainty: identify threats and opportunities, assess, mitigate, monitor, and adapt.'] }
    ],
    traps: ['Treating PPPM AI guidance as separate from CPMAI.', 'Failing to align project AI work with portfolio/program strategy.', 'Ignoring stakeholder resistance and change management.', 'No data quality governance at enterprise level.'],
    checklist: ['Can I name the eight principles?', 'Can I name the five performance domains?', 'Can I apply stakeholder engagement to AI adoption?', 'Can I connect data quality and governance to CPMAI phases?'],
    quiz: [{ q: 'Which PPPM principle is most directly connected to “input for impact”?', a: 'Data Quality.' }]
  },
  {
    id: 'final-review',
    title: 'Final Review: Exam Traps, Decision Rules, and 30-Day Plan',
    badge: 'Revision',
    color: '#be123c',
    minutes: 75,
    summary: 'This final chapter compresses the high-yield rules: business before model, data before training, governance throughout, evaluation before deployment, monitoring after go-live, and iteration whenever evidence demands it.',
    objectives: ['Review the highest-yield exam traps.', 'Memorize PMI-style decision rules.', 'Use a 30-day study plan.', 'Connect study chapters to practice and mock exams.'],
    sections: [
      { title: 'High-yield decision rules', body: 'When in doubt, pick the answer that improves disciplined delivery and reduces unmanaged uncertainty. PMI-CPMAI rewards structured judgment more than technical excitement.', bullets: ['Clarify business value before technical design.', 'Assess non-AI alternatives before choosing AI.', 'Verify data access, rights, quality, and representativeness before training.', 'Embed trustworthy AI from Phase I, not at the end.', 'Evaluate business KPIs and technical metrics before deployment.', 'Operationalize with monitoring, governance, retraining, rollback, and ownership.', 'Iterate to earlier phases when evidence shows gaps.'] },
      { title: '30-day plan', body: 'A practical plan: Days 1–5 foundations and patterns. Days 6–12 Phase I and trustworthy AI. Days 13–18 Data Understanding and Preparation. Days 19–23 Model Development and Evaluation. Days 24–26 Operationalization, GenAI, agents, and PPPM standard. Days 27–30 mock exams, missed-question review, traps, and final cheat sheets.', bullets: ['Daily: read one chapter, make notes, do related practice questions.', 'Every 3 days: review missed questions by domain and update traps list.', 'Weekly: complete one timed mock exam and analyze errors.', 'Final 48 hours: focus on decision rules, Go/No-Go, metrics, trustworthy AI, and operationalization.'] }
    ],
    traps: ['Studying definitions without scenario practice.', 'Reviewing only correct answers and ignoring wrong-answer logic.', 'Ignoring weak domains shown by analytics.', 'Taking mocks without timing discipline.'],
    checklist: ['I can explain all phases from memory.', 'I can recognize when to stop, iterate, or proceed.', 'I can choose metrics by model type.', 'I can explain trustworthy AI phase by phase.', 'I can manage GenAI and agentic AI risks.'],
    quiz: [{ q: 'What is the safest exam answer when a model is underperforming because production data differs from training data?', a: 'Investigate data drift/distribution shift, review data understanding/preparation, update monitoring and retraining approach, and do not blindly continue deployment.' }]
  }
];

function loadJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function pct(a, b) {
  return b ? Math.round((a / b) * 100) : 0;
}

function mmss(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem(LS.dark) === 'true');
  const [tab, setTab] = useState(() => localStorage.getItem(LS.tab) || 'home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [answers, setAnswers] = useState(() => loadJSON(LS.answers, {}));
  const [examAnswers, setExamAnswers] = useState(() => loadJSON(LS.examAnswers, {}));
  const [bookmarks, setBookmarks] = useState(() => loadJSON(LS.bookmarks, []));
  const [notes, setNotes] = useState(() => localStorage.getItem(LS.notes) || '');
  const [studyProgress, setStudyProgress] = useState(() => loadJSON(LS.studyProgress, {}));
  const [studyBookmarks, setStudyBookmarks] = useState(() => loadJSON(LS.studyBookmarks, []));
  const [studyNotes, setStudyNotes] = useState(() => loadJSON(LS.studyNotes, {}));
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [mode, setMode] = useState('adaptive');
  const [current, setCurrent] = useState(0);
  const [revealedPractice, setRevealedPractice] = useState({});
  const [lockedPracticeQuestionId, setLockedPracticeQuestionId] = useState(null);
  const [examId, setExamId] = useState(() => Number(localStorage.getItem(LS.currentExam) || 1));
  const [examCurrent, setExamCurrent] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(160 * 60);

  const questions = data.questions || [];
  const domains = data.domains || [];
  const mockExams = data.mockExams || [];
  const flashcards = data.flashcards || [];

  useEffect(() => {
    localStorage.setItem(LS.dark, String(dark));
    localStorage.setItem(LS.tab, tab);
    localStorage.setItem(LS.answers, JSON.stringify(answers));
    localStorage.setItem(LS.examAnswers, JSON.stringify(examAnswers));
    localStorage.setItem(LS.bookmarks, JSON.stringify(bookmarks));
    localStorage.setItem(LS.notes, notes);
    localStorage.setItem(LS.currentExam, String(examId));
    localStorage.setItem(LS.studyProgress, JSON.stringify(studyProgress));
    localStorage.setItem(LS.studyBookmarks, JSON.stringify(studyBookmarks));
    localStorage.setItem(LS.studyNotes, JSON.stringify(studyNotes));
  }, [dark, tab, answers, examAnswers, bookmarks, notes, examId, studyProgress, studyBookmarks, studyNotes]);

  useEffect(() => {
    if (!examStarted || examSubmitted) return;
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [examStarted, examSubmitted]);

  useEffect(() => {
    if (secondsLeft === 0 && examStarted) setExamSubmitted(true);
  }, [secondsLeft, examStarted]);

  const stats = useMemo(() => domains.map((d) => {
    const qs = questions.filter((q) => q.domain === d.id);
    const done = qs.filter((q) => answers[q.id]);
    const correct = done.filter((q) => answers[q.id] === q.answer);
    return { ...d, total: qs.length, done: done.length, correct: correct.length, missed: done.length - correct.length, rate: pct(correct.length, done.length) };
  }), [answers, domains, questions]);

  const weak = useMemo(() => [...stats].sort((a, b) => (a.rate - b.rate) || (a.done - b.done)).slice(0, 2), [stats]);
  const overallDone = Object.keys(answers).length;
  const overallCorrect = questions.filter((q) => answers[q.id] === q.answer).length;
  const overallRate = pct(overallCorrect, overallDone);
  const studyDone = Object.values(studyProgress).filter(Boolean).length;
  const studyRate = pct(studyDone, STUDY_BOOK.length);

  const filtered = useMemo(() => {
    let pool = questions.filter((q) => (domain === 'all' || q.domain === domain) && (difficulty === 'all' || q.difficulty === difficulty));
    if (query.trim()) {
      const s = query.toLowerCase();
      pool = pool.filter((q) => `${q.question} ${q.topic} ${q.domainName} ${q.trap} ${(q.options || []).map((o) => o.text).join(' ')}`.toLowerCase().includes(s));
    }
    if (mode === 'unanswered') pool = pool.filter((q) => !answers[q.id]);
    if (mode === 'missed') pool = pool.filter((q) => answers[q.id] && answers[q.id] !== q.answer);
    if (mode === 'bookmarked') pool = pool.filter((q) => bookmarks.includes(q.id));
    if (mode === 'adaptive') {
      const weakIds = weak.map((w) => w.id);
      pool = [...pool].sort((a, b) => {
        const wa = weakIds.includes(a.domain) ? 0 : 1;
        const wb = weakIds.includes(b.domain) ? 0 : 1;
        return wa - wb || a.id - b.id;
      });
    }
    return pool;
  }, [questions, domain, difficulty, query, mode, answers, bookmarks, weak]);

  const lockedPracticeQuestion = lockedPracticeQuestionId ? questions.find((q) => q.id === lockedPracticeQuestionId) : null;
  const practiceQ = lockedPracticeQuestion || filtered[Math.min(current, Math.max(0, filtered.length - 1))];
  const exam = mockExams.find((e) => e.id === examId) || mockExams[0] || { id: 1, questionIds: [] };
  const examQuestions = (exam.questionIds || []).map((id) => questions.find((q) => q.id === id)).filter(Boolean);
  const examQ = examQuestions[Math.min(examCurrent, Math.max(0, examQuestions.length - 1))];
  const examKey = 'exam' + examId;
  const currentExamAnswers = examAnswers[examKey] || {};
  const examAnswered = Object.keys(currentExamAnswers).length;
  const examCorrect = examQuestions.filter((q) => currentExamAnswers[q.id] === q.answer).length;
  const examScore = pct(examCorrect, examQuestions.length);

  function nav(id) { setTab(id); setMobileOpen(false); setCurrent(0); setLockedPracticeQuestionId(null); }
  function answerPractice(qid, key) { setLockedPracticeQuestionId(qid); setAnswers((prev) => ({ ...prev, [qid]: key })); setRevealedPractice((prev) => ({ ...prev, [qid]: true })); }
  function movePractice(nextIndex) { setLockedPracticeQuestionId(null); setCurrent(Math.max(0, Math.min(filtered.length - 1, nextIndex))); }
  function answerExam(qid, key) { setExamAnswers((prev) => ({ ...prev, [examKey]: { ...(prev[examKey] || {}), [qid]: key } })); }
  function moveExam(nextIndex) { setExamCurrent(Math.max(0, Math.min(examQuestions.length - 1, nextIndex))); }
  function toggleBookmark(id) { setBookmarks((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]); }
  function reset() { if (window.confirm('Reset all practice answers, exam answers, bookmarks, study progress and notes?')) { setAnswers({}); setExamAnswers({}); setBookmarks([]); setNotes(''); setStudyProgress({}); setStudyBookmarks([]); setStudyNotes({}); setRevealedPractice({}); setLockedPracticeQuestionId(null); setCurrent(0); setExamCurrent(0); setExamStarted(false); setExamSubmitted(false); setSecondsLeft(160 * 60); } }
  function startExam(id) { setExamId(id); setExamStarted(true); setExamSubmitted(false); setExamCurrent(0); setSecondsLeft(160 * 60); setExamAnswers((prev) => ({ ...prev, ['exam' + id]: {} })); }

  const navItems = [
    ['home', Home, 'Dashboard'],
    ['guide', BookOpen, 'Study Book'],
    ['practice', Target, 'Practice'],
    ['exam', ClipboardList, 'Mock Exams'],
    ['flash', Brain, 'Flashcards'],
    ['stats', BarChart3, 'Stats'],
    ['bookmarks', Bookmark, 'Bookmarks'],
    ['notes', StickyNote, 'Notes']
  ];

  return (
    <div className={`app ${dark ? 'dark' : ''}`}>
      <EnhancedStyles />
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sideBrand"><div className="brandMark">AI</div><div><b>CPMAI Studio</b><span>v3 Study Book</span></div><button className="mobileClose" onClick={() => setMobileOpen(false)}><X size={18} /></button></div>
        <nav>{navItems.map(([id, Icon, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => nav(id)}><Icon size={18} />{label}</button>)}</nav>
        <div className="sideNote"><ShieldCheck size={18} /><span>PMI-aligned original study book, practice, mocks and revision tools.</span></div>
      </aside>
      <main className="main">
        <header className="topbar"><button className="hamb" onClick={() => setMobileOpen(true)}><Menu /></button><div><h1>CPMAI Exam Studio v3 Premium</h1><p>Full Study Book • Visual learning • Practice questions • Mock exams • Offline progress</p></div><div className="topActions"><button onClick={() => setDark(!dark)}>{dark ? <Sun /> : <Moon />}</button><button onClick={reset}><RotateCcw /></button></div></header>
        <section className="heroCards">
          <Metric icon={<BookOpen />} title="Study Book" value={`${studyRate}%`} sub={`${studyDone}/${STUDY_BOOK.length} chapters complete`} />
          <Metric icon={<Trophy />} title="Practice Score" value={`${overallRate}%`} sub={`${overallDone}/4000 answered`} />
          <Metric icon={<Flame />} title="Adaptive Focus" value={weak[0]?.name ? weak[0].name.split(' ').slice(0, 3).join(' ') : 'Start Practice'} sub="Lowest mastery area" />
          <Metric icon={<ClipboardList />} title="Mock Format" value="120 Q" sub="160 minutes each" />
        </section>
        {tab === 'home' && <Dashboard stats={stats} nav={nav} weak={weak} studyRate={studyRate} />}
        {tab === 'guide' && <StudyBook progress={studyProgress} setProgress={setStudyProgress} bookmarks={studyBookmarks} setBookmarks={setStudyBookmarks} notes={studyNotes} setNotes={setStudyNotes} nav={nav} />}
        {tab === 'practice' && <PracticePanel q={practiceQ} list={filtered} current={current} setCurrent={movePractice} answer={answerPractice} selected={practiceQ && revealedPractice[practiceQ.id] ? answers[practiceQ.id] : null} toggleBookmark={toggleBookmark} bookmarks={bookmarks} query={query} setQuery={(v) => { setQuery(v); setCurrent(0); setLockedPracticeQuestionId(null); }} domain={domain} setDomain={(v) => { setDomain(v); setCurrent(0); setLockedPracticeQuestionId(null); }} difficulty={difficulty} setDifficulty={(v) => { setDifficulty(v); setCurrent(0); setLockedPracticeQuestionId(null); }} mode={mode} setMode={(v) => { setMode(v); setCurrent(0); setLockedPracticeQuestionId(null); }} domains={domains} />}
        {tab === 'exam' && <ExamPanel exams={mockExams} examId={examId} setExamId={setExamId} startExam={startExam} examStarted={examStarted} examSubmitted={examSubmitted} setExamSubmitted={setExamSubmitted} secondsLeft={secondsLeft} q={examQ} list={examQuestions} current={examCurrent} setCurrent={moveExam} answer={answerExam} selected={examQ ? currentExamAnswers[examQ.id] : null} answered={examAnswered} score={examScore} correct={examCorrect} toggleBookmark={toggleBookmark} bookmarks={bookmarks} />}
        {tab === 'flash' && <Flashcards flashcards={flashcards} domains={domains} />}
        {tab === 'stats' && <Stats stats={stats} weak={weak} overallRate={overallRate} studyRate={studyRate} />}
        {tab === 'bookmarks' && <Bookmarks questions={questions} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />}
        {tab === 'notes' && <Notes notes={notes} setNotes={setNotes} />}
      </main>
    </div>
  );
}

function Metric({ icon, title, value, sub }) { return <div className="metric"><div className="metricIcon">{icon}</div><p>{title}</p><h3>{value}</h3><span>{sub}</span></div>; }

function Dashboard({ stats, nav, weak, studyRate }) {
  return <section className="panel dashboard"><div className="intro"><div><span className="eyebrow">Exam cockpit</span><h2>Train the judgment pattern: business value, data readiness, trustworthy AI, evaluation, and operationalization.</h2><p>This v3 build adds a detailed PMI-aligned study book with visual chapter cards, checklists, traps, quizzes, progress tracking and links back to practice.</p></div><div className="bigNumber"><b>{studyRate}%</b><span>study complete</span></div></div><div className="quick"><button onClick={() => nav('guide')}><BookOpen /> Study book</button><button onClick={() => nav('practice')}><Target /> Adaptive practice</button><button onClick={() => nav('exam')}><ClipboardList /> Mock exam</button></div><h3>Recommended focus</h3><div className="focusGrid">{weak.map((w) => <div className="focus" key={w.id} style={{ borderColor: w.color }}><b>{w.name}</b><span>{w.rate}% score • {w.done}/{w.total} practiced</span></div>)}</div><h3>Official-domain weighted roadmap</h3><div className="roadmap">{stats.map((s) => <div className="road" key={s.id}><div><b>{s.name}</b><span>{s.weight}% exam weighting • {s.total} practice questions</span></div><strong>{s.rate}%</strong><div className="bar"><i style={{ width: `${Math.max(4, s.rate)}%`, background: s.color }} /></div></div>)}</div></section>;
}

function StudyBook({ progress, setProgress, bookmarks, setBookmarks, notes, setNotes, nav }) {
  const [chapterId, setChapterId] = useState(STUDY_BOOK[0].id);
  const [view, setView] = useState('book');
  const [search, setSearch] = useState('');
  const [slide, setSlide] = useState(0);
  const chapter = STUDY_BOOK.find((c) => c.id === chapterId) || STUDY_BOOK[0];
  const filtered = STUDY_BOOK.filter((c) => `${c.title} ${c.summary} ${c.objectives.join(' ')} ${c.sections.map((s) => `${s.title} ${s.body} ${s.bullets.join(' ')}`).join(' ')}`.toLowerCase().includes(search.toLowerCase()));
  const slides = makeSlides(chapter);
  const bookmarked = bookmarks.includes(chapter.id);
  function toggleDone() { setProgress((prev) => ({ ...prev, [chapter.id]: !prev[chapter.id] })); }
  function toggleStudyBookmark() { setBookmarks((prev) => prev.includes(chapter.id) ? prev.filter((x) => x !== chapter.id) : [...prev, chapter.id]); }
  function updateNote(value) { setNotes((prev) => ({ ...prev, [chapter.id]: value })); }
  function choose(id) { setChapterId(id); setSlide(0); }
  return <section className="studyBookShell"><div className="studySidebar panel"><div className="studySearch"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search study book..." /></div><div className="studyToggles"><button className={view === 'book' ? 'active' : ''} onClick={() => setView('book')}>Book</button><button className={view === 'slides' ? 'active' : ''} onClick={() => setView('slides')}>Slides</button><button className={view === 'review' ? 'active' : ''} onClick={() => setView('review')}>Review</button></div><div className="chapterList">{filtered.map((c) => <button key={c.id} className={c.id === chapter.id ? 'active' : ''} onClick={() => choose(c.id)} style={{ '--accent': c.color }}><span>{progress[c.id] ? '✓' : c.badge}</span><b>{c.title}</b><small>{c.minutes} min</small></button>)}</div><p className="sourceNote">{SOURCE_NOTE}</p></div><article className="panel studyContent">{view === 'book' && <BookView chapter={chapter} done={!!progress[chapter.id]} bookmarked={bookmarked} toggleDone={toggleDone} toggleBookmark={toggleStudyBookmark} note={notes[chapter.id] || ''} updateNote={updateNote} nav={nav} />}{view === 'slides' && <SlideView chapter={chapter} slides={slides} slide={slide} setSlide={setSlide} />}{view === 'review' && <ReviewView chapter={chapter} />}</article></section>;
}

function makeSlides(chapter) {
  const base = [
    { title: chapter.title, body: chapter.summary, bullets: chapter.objectives },
    ...chapter.sections.map((s) => ({ title: s.title, body: s.body, bullets: s.bullets })),
    { title: 'Exam traps', body: 'Avoid these wrong-answer patterns.', bullets: chapter.traps },
    { title: 'Checklist', body: 'Use this as your readiness gate before moving on.', bullets: chapter.checklist }
  ];
  return base;
}

function BookView({ chapter, done, bookmarked, toggleDone, toggleBookmark, note, updateNote, nav }) {
  return <div><div className="chapterHero" style={{ '--accent': chapter.color }}><span className="eyebrow">{chapter.badge} • {chapter.minutes} minutes</span><h2>{chapter.title}</h2><p>{chapter.summary}</p><div className="chapterActions"><button onClick={toggleDone}>{done ? <CheckCircle2 /> : <Target />} {done ? 'Completed' : 'Mark complete'}</button><button onClick={toggleBookmark}><Bookmark className={bookmarked ? 'filled' : ''} /> {bookmarked ? 'Bookmarked' : 'Bookmark'}</button><button onClick={() => nav('practice')}><Rocket /> Practice related judgment</button></div></div><div className="studyBlock"><h3>Learning objectives</h3><ul>{chapter.objectives.map((o) => <li key={o}>{o}</li>)}</ul></div>{chapter.sections.map((sec, idx) => <div className="studyBlock" key={sec.title}><span className="sectionNumber">{String(idx + 1).padStart(2, '0')}</span><h3>{sec.title}</h3><p>{sec.body}</p><ul>{sec.bullets.map((b) => <li key={b}>{b}</li>)}</ul></div>)}<div className="studyGrid"><div className="studyBlock warning"><h3>Exam traps</h3><ul>{chapter.traps.map((t) => <li key={t}>{t}</li>)}</ul></div><div className="studyBlock success"><h3>Readiness checklist</h3><ul>{chapter.checklist.map((c) => <li key={c}>{c}</li>)}</ul></div></div><div className="studyBlock"><h3>Chapter quiz</h3>{chapter.quiz.map((q, i) => <details key={q.q}><summary>{i + 1}. {q.q}</summary><p>{q.a}</p></details>)}</div><div className="studyBlock"><h3>Your notes for this chapter</h3><textarea value={note} onChange={(e) => updateNote(e.target.value)} placeholder="Write your own exam traps, memory hooks, and missed-question notes here..." /></div></div>;
}

function SlideView({ chapter, slides, slide, setSlide }) {
  const s = slides[Math.min(slide, slides.length - 1)];
  return <div className="slideMode"><div className="slideCard" style={{ '--accent': chapter.color }}><span className="eyebrow">Slide {slide + 1} of {slides.length}</span><h2>{s.title}</h2><p>{s.body}</p><ul>{s.bullets.map((b) => <li key={b}>{b}</li>)}</ul></div><div className="pager"><button onClick={() => setSlide(Math.max(0, slide - 1))}>Previous</button><button onClick={() => setSlide(Math.min(slides.length - 1, slide + 1))}>Next</button></div></div>;
}

function ReviewView({ chapter }) {
  return <div><div className="chapterHero" style={{ '--accent': chapter.color }}><span className="eyebrow">Rapid revision</span><h2>{chapter.title}</h2><p>Use this mode in the last week before your exam.</p></div><div className="studyGrid"><div className="studyBlock"><h3>Must know</h3><ul>{chapter.objectives.map((o) => <li key={o}>{o}</li>)}</ul></div><div className="studyBlock warning"><h3>Do not fall for</h3><ul>{chapter.traps.map((t) => <li key={t}>{t}</li>)}</ul></div></div><div className="studyBlock success"><h3>Final self-test</h3>{chapter.quiz.map((q, i) => <details key={q.q}><summary>{i + 1}. {q.q}</summary><p>{q.a}</p></details>)}</div></div>;
}

function PracticePanel(props) { return <section className="panel"><QuestionToolbar {...props} /><QuestionCard {...props} revealOnSelect={true} examSubmitted={false} /></section>; }
function QuestionToolbar({ query, setQuery, domain, setDomain, difficulty, setDifficulty, mode, setMode, domains, list }) { return <div className="toolbar"><div className="search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search 4,000 questions by scenario, topic, trap, domain..." /></div><select value={domain} onChange={(e) => setDomain(e.target.value)}><option value="all">All domains</option>{domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select><select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option value="all">All difficulty</option><option>Foundation</option><option>Moderate</option><option>Hard</option><option>Exam Trap</option></select><select value={mode} onChange={(e) => setMode(e.target.value)}><option value="adaptive">Adaptive</option><option value="unanswered">Unanswered</option><option value="missed">Missed</option><option value="bookmarked">Bookmarked</option></select><span className="count">{list.length} results</span></div>; }
function QuestionCard({ q, list, current, setCurrent, answer, selected, toggleBookmark, bookmarks, revealOnSelect = false, examSubmitted = false }) { if (!q) return <div className="empty">No questions match your filters.</div>; const reveal = (revealOnSelect && Boolean(selected)) || Boolean(examSubmitted); return <div className="question"><div className="qTop"><span>Question {current + 1} of {list.length} • {q.domainName} • {q.topic} • {q.difficulty}</span><button className="iconBtn" onClick={() => toggleBookmark(q.id)}><Bookmark className={bookmarks.includes(q.id) ? 'filled' : ''} /></button></div><h2>{q.question}</h2><div className="options">{(q.options || []).map((opt) => { const isSel = selected === opt.key; const isCorrect = opt.key === q.answer; const cls = reveal && isCorrect ? 'correct' : reveal && isSel && !isCorrect ? 'wrong' : isSel ? 'selected' : ''; return <button key={opt.key} className={cls} onClick={() => answer(q.id, opt.key)}><b>{opt.key}</b><span>{opt.text}</span>{reveal && isCorrect && <CheckCircle2 />}{reveal && isSel && !isCorrect && <XCircle />}</button>; })}</div>{reveal && <div className="explain"><h3>{!selected ? 'Not answered' : selected === q.answer ? 'Correct' : 'Review this one'}</h3><p>{q.summary}</p>{(q.options || []).map((opt) => <div key={opt.key} className={opt.key === q.answer ? 'why good' : 'why'}><b>{opt.key}</b><span>{q.explanations ? q.explanations[opt.key] : ''}</span></div>)}</div>}<div className="pager"><button onClick={() => setCurrent(current - 1)}>Previous</button><button onClick={() => setCurrent(current + 1)}>Next</button></div></div>; }
function ExamPanel({ exams, examId, setExamId, startExam, examStarted, examSubmitted, setExamSubmitted, secondsLeft, q, list, current, setCurrent, answer, selected, answered, score, correct, toggleBookmark, bookmarks }) { return <section className="panel"><div className="examHead"><div><span className="eyebrow">Updated mock exams</span><h2>10 full domain-weighted mock exams</h2><p className="lead">Each mock exam has 120 questions, 160 minutes, and the same domain balance as the blueprint.</p></div><div className="timer"><Timer /> {mmss(secondsLeft)}</div></div><div className="mockGrid">{exams.map((e) => <button key={e.id} className={examId === e.id ? 'active' : ''} onClick={() => setExamId(e.id)}>{e.name}</button>)}</div><div className="examActions"><button onClick={() => startExam(examId)}><Rocket /> Start / Restart selected mock</button>{examStarted && !examSubmitted && <button onClick={() => setExamSubmitted(true)}><CheckCircle2 /> Submit exam</button>}</div>{examStarted && <div><div className="examProgress"><span>{answered}/{list.length} answered</span><span>{examSubmitted ? `Score ${score}% (${correct}/${list.length})` : 'Explanations hidden until submit'}</span></div><QuestionCard q={q} list={list} current={current} setCurrent={setCurrent} answer={answer} selected={selected} toggleBookmark={toggleBookmark} bookmarks={bookmarks} revealOnSelect={false} examSubmitted={examSubmitted} /></div>}</section>; }
function Flashcards({ flashcards, domains }) { const [i, setI] = useState(0); const [flip, setFlip] = useState(false); if (!flashcards.length) return <section className="panel center"><h2>No flashcards available</h2></section>; const card = flashcards[i] || flashcards[0]; const dom = domains.find((d) => d.id === card.domain) || { name: 'CPMAI', color: '#111827' }; return <section className="panel center"><span className="eyebrow">Flashcards</span><h2>High-yield recall and exam traps</h2><p className="lead">Card {i + 1} of {flashcards.length} • {dom.name}</p><button className="flash" style={{ background: `linear-gradient(135deg, ${dom.color}, #111827)` }} onClick={() => setFlip(!flip)}>{flip ? card.back : card.front}</button><div className="pager centerPager"><button onClick={() => { setI(Math.max(0, i - 1)); setFlip(false); }}>Previous</button><button onClick={() => setFlip(!flip)}>{flip ? 'Show front' : 'Show answer'}</button><button onClick={() => { setI((i + 1) % flashcards.length); setFlip(false); }}>Next</button></div></section>; }
function Stats({ stats, weak, overallRate, studyRate }) { return <section className="panel"><span className="eyebrow">Performance analytics</span><h2>Weak-area recommendations</h2><p className="lead">Study completion: <b>{studyRate}%</b>. Practice score: <b>{overallRate}%</b>. Next focus: <b>{weak.map((w) => w.name).join(' and ')}</b>.</p>{stats.map((s) => <div className="stat" key={s.id}><div><b>{s.name}</b><span>{s.done}/{s.total} answered • {s.correct} correct • {s.missed} missed</span></div><strong>{s.rate}%</strong><div className="bar"><i style={{ width: `${Math.max(3, s.rate)}%`, background: s.color }} /></div></div>)}</section>; }
function Bookmarks({ questions, bookmarks, toggleBookmark }) { const saved = questions.filter((q) => bookmarks.includes(q.id)); return <section className="panel"><span className="eyebrow">Saved review</span><h2>Bookmarked questions</h2>{!saved.length && <p className="lead">No bookmarked questions yet.</p>}{saved.slice(0, 500).map((q) => <div className="saved" key={q.id}><button className="iconBtn" onClick={() => toggleBookmark(q.id)}><Bookmark className="filled" /></button><div><b>Q{q.id} • {q.topic}</b><p>{q.question}</p><small>{q.summary}</small></div></div>)}</section>; }
function Notes({ notes, setNotes }) { return <section className="panel"><span className="eyebrow">Offline notes</span><h2>Your CPMAI notebook</h2><p className="lead">Saved locally in this browser. Use it for missed-question patterns and exam traps.</p><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Example: If the answer rushes to model training before problem/data/governance readiness, it is probably a trap..." /></section>; }

function EnhancedStyles() {
  return <style>{`
    .studyBookShell{display:grid;grid-template-columns:310px minmax(0,1fr);gap:18px;align-items:start}.studySidebar{position:sticky;top:18px;max-height:calc(100vh - 36px);overflow:auto}.studySearch{display:flex;gap:8px;align-items:center;border:1px solid rgba(148,163,184,.35);border-radius:14px;padding:10px 12px;margin-bottom:12px}.studySearch input{border:0;outline:0;background:transparent;color:inherit;width:100%}.studyToggles{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}.studyToggles button{border:1px solid rgba(148,163,184,.35);border-radius:12px;padding:9px;background:transparent;color:inherit}.studyToggles button.active{background:#2563eb;color:white}.chapterList{display:flex;flex-direction:column;gap:9px}.chapterList button{text-align:left;border:1px solid rgba(148,163,184,.35);border-left:5px solid var(--accent);border-radius:14px;padding:11px;background:rgba(255,255,255,.03);color:inherit;display:grid;gap:4px}.chapterList button.active{box-shadow:0 0 0 2px var(--accent);background:rgba(37,99,235,.08)}.chapterList span{font-size:11px;text-transform:uppercase;opacity:.75}.chapterList small{opacity:.65}.sourceNote{font-size:11px;opacity:.7;line-height:1.45;margin-top:14px}.chapterHero{border-radius:24px;padding:24px;background:linear-gradient(135deg,var(--accent),#0f172a);color:white;margin-bottom:18px}.chapterHero h2{font-size:34px;margin:8px 0}.chapterHero p{font-size:16px;line-height:1.65;max-width:900px}.chapterActions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.chapterActions button,.pager button,.examActions button,.quick button{display:inline-flex;align-items:center;gap:8px}.studyBlock{border:1px solid rgba(148,163,184,.25);border-radius:20px;padding:20px;margin-bottom:16px;background:rgba(255,255,255,.035)}.studyBlock h3{margin-top:0}.studyBlock p,.studyBlock li{line-height:1.65}.studyBlock ul{padding-left:22px}.sectionNumber{font-size:12px;font-weight:800;color:#64748b;letter-spacing:.12em}.studyGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.warning{border-color:rgba(239,68,68,.35);background:rgba(239,68,68,.06)}.success{border-color:rgba(34,197,94,.35);background:rgba(34,197,94,.06)}details{border:1px solid rgba(148,163,184,.25);border-radius:14px;padding:12px;margin:10px 0}summary{cursor:pointer;font-weight:700}.slideMode{display:grid;gap:16px}.slideCard{min-height:520px;border-radius:28px;padding:42px;background:linear-gradient(135deg,var(--accent),#111827);color:white;display:flex;flex-direction:column;justify-content:center}.slideCard h2{font-size:42px;margin:10px 0}.slideCard p{font-size:20px;line-height:1.6}.slideCard li{font-size:18px;line-height:1.7;margin:8px 0}.studyContent textarea,.panel textarea{width:100%;min-height:150px;border-radius:16px;border:1px solid rgba(148,163,184,.35);padding:14px;background:transparent;color:inherit}.filled{fill:currentColor}@media(max-width:900px){.studyBookShell{grid-template-columns:1fr}.studySidebar{position:relative;top:auto;max-height:none}.studyGrid{grid-template-columns:1fr}.chapterHero h2,.slideCard h2{font-size:28px}.slideCard{min-height:420px;padding:26px}}
  `}</style>;
}
