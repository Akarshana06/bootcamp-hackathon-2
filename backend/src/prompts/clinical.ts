/**
 * System prompt for clinical text analysis
 * This ensures the AI follows medical guidelines and avoids hallucinations
 */
export const CLINICAL_ANALYSIS_SYSTEM_PROMPT = `You are a clinical assistant designed to help with medical text analysis. 
Your responses must be:
1. Evidence-based and cite sources when possible
2. Cautious about making definitive diagnoses
3. Clear about the limitations of the information provided
4. Respectful of patient privacy (no PHI)
5. Focused on safety and risk mitigation

If you're unsure about any medical information, say so explicitly rather than guessing.`;

/**
 * Prompt for validating clinical procedures
 */
export const PROCEDURE_VALIDATION_PROMPT = (procedureText: string, context: string) => `
Analyze the following clinical procedure for potential issues, safety concerns, or inaccuracies.

PROCEDURE:
${procedureText}

CONTEXT:
${context}

Provide a structured analysis with the following sections:
1. Safety Concerns: List any potential safety issues or risks
2. Missing Steps: Note any critical steps that appear to be missing
3. Best Practices: Suggest improvements based on current medical guidelines
4. References: Cite any relevant medical guidelines or studies

If the procedure appears to be correct and complete, state that clearly.`;

/**
 * Prompt for generating clinical notes
 */
export const CLINICAL_NOTE_PROMPT = (patientInfo: string, clinicalFindings: string) => `
Generate a structured clinical note based on the following information.

PATIENT INFORMATION:
${patientInfo}

CLINICAL FINDINGS:
${clinicalFindings}

Generate a SOAP note (Subjective, Objective, Assessment, Plan) that is:
- Clear and concise
- Medically accurate
- Properly formatted
- Free of personal health information (PHI)
- Includes relevant medical codes (ICD-10, CPT) where appropriate`;

/**
 * Prompt for medical terminology explanation
 */
export const MEDICAL_TERM_EXPLANATION_PROMPT = (term: string) => `
Explain the following medical term in simple, non-technical language:
Term: ${term}

Provide:
1. A simple definition
2. A practical example of when this term might be used
3. Any related terms or concepts
4. When to seek medical attention (if applicable)

Keep the explanation clear and accessible to non-medical professionals.`;

/**
 * Prompt for drug interaction check
 */
export const DRUG_INTERACTION_PROMPT = (medications: string[]) => `
Analyze the following list of medications for potential interactions:
${medications.join('\n')}

For each potential interaction found, provide:
1. The specific drugs involved
2. Type of interaction (pharmacokinetic, pharmacodynamic, etc.)
3. Severity (major, moderate, minor)
4. Clinical implications
5. Recommended actions

If no significant interactions are found, state that clearly.`;
