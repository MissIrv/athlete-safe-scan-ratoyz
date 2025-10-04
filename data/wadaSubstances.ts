
export interface WADASubstance {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  examples?: string[];
  prohibitedStatus: 'always' | 'in-competition' | 'particular-sports';
  notes?: string;
}

export const wadaCategories = [
  'S0. Non-approved substances',
  'S1. Anabolic agents',
  'S2. Peptide hormones, growth factors, related substances and mimetics',
  'S3. Beta-2 agonists',
  'S4. Hormone and metabolic modulators',
  'S5. Diuretics and masking agents',
  'S6. Stimulants',
  'S7. Narcotics',
  'S8. Cannabinoids',
  'S9. Glucocorticoids',
  'M1. Enhancement of oxygen transfer',
  'M2. Chemical and physical manipulation',
  'M3. Gene and cell doping',
  'P1. Beta-blockers',
  'P2. Particular sports substances'
];

export const wadaSubstances: WADASubstance[] = [
  // S0. Non-approved substances
  {
    id: 's0-001',
    name: 'Non-approved substances',
    category: 'S0. Non-approved substances',
    description: 'Any pharmacological substance which is not addressed by any of the subsequent sections of the List and with no current approval by any governmental regulatory health authority for human therapeutic use.',
    prohibitedStatus: 'always',
    notes: 'Includes investigational drugs and designer drugs'
  },

  // S1. Anabolic agents
  {
    id: 's1-001',
    name: 'Testosterone',
    category: 'S1. Anabolic agents',
    subcategory: 'Anabolic androgenic steroids',
    description: 'Primary male sex hormone and anabolic steroid',
    examples: ['Testosterone cypionate', 'Testosterone enanthate', 'Testosterone propionate'],
    prohibitedStatus: 'always'
  },
  {
    id: 's1-002',
    name: 'Nandrolone',
    category: 'S1. Anabolic agents',
    subcategory: 'Anabolic androgenic steroids',
    description: 'Synthetic anabolic-androgenic steroid',
    examples: ['Nandrolone decanoate', 'Nandrolone phenylpropionate'],
    prohibitedStatus: 'always'
  },
  {
    id: 's1-003',
    name: 'Stanozolol',
    category: 'S1. Anabolic agents',
    subcategory: 'Anabolic androgenic steroids',
    description: 'Synthetic anabolic steroid derived from dihydrotestosterone',
    prohibitedStatus: 'always'
  },
  {
    id: 's1-004',
    name: 'SARMs',
    category: 'S1. Anabolic agents',
    subcategory: 'Other anabolic agents',
    description: 'Selective Androgen Receptor Modulators',
    examples: ['Ostarine', 'Ligandrol', 'RAD140', 'Andarine'],
    prohibitedStatus: 'always'
  },

  // S2. Peptide hormones
  {
    id: 's2-001',
    name: 'EPO (Erythropoietin)',
    category: 'S2. Peptide hormones, growth factors, related substances and mimetics',
    description: 'Hormone that stimulates red blood cell production',
    examples: ['Epoetin alfa', 'Epoetin beta', 'Darbepoetin alfa'],
    prohibitedStatus: 'always'
  },
  {
    id: 's2-002',
    name: 'Growth Hormone (hGH)',
    category: 'S2. Peptide hormones, growth factors, related substances and mimetics',
    description: 'Human growth hormone and its releasing factors',
    examples: ['Somatropin', 'GHRP-6', 'Ipamorelin'],
    prohibitedStatus: 'always'
  },
  {
    id: 's2-003',
    name: 'Insulin',
    category: 'S2. Peptide hormones, growth factors, related substances and mimetics',
    description: 'Hormone that regulates blood sugar levels',
    prohibitedStatus: 'always',
    notes: 'Except for athletes with diabetes who have a valid TUE'
  },

  // S3. Beta-2 agonists
  {
    id: 's3-001',
    name: 'Salbutamol',
    category: 'S3. Beta-2 agonists',
    description: 'Bronchodilator used to treat asthma',
    prohibitedStatus: 'in-competition',
    notes: 'Permitted by inhalation up to 1600 micrograms per 24 hours'
  },
  {
    id: 's3-002',
    name: 'Clenbuterol',
    category: 'S3. Beta-2 agonists',
    description: 'Beta-2 agonist with anabolic properties',
    prohibitedStatus: 'always'
  },

  // S4. Hormone and metabolic modulators
  {
    id: 's4-001',
    name: 'Tamoxifen',
    category: 'S4. Hormone and metabolic modulators',
    subcategory: 'Anti-estrogenic substances',
    description: 'Selective estrogen receptor modulator',
    prohibitedStatus: 'always'
  },
  {
    id: 's4-002',
    name: 'Insulin',
    category: 'S4. Hormone and metabolic modulators',
    subcategory: 'Metabolic modulators',
    description: 'Hormone affecting glucose metabolism',
    prohibitedStatus: 'always'
  },

  // S5. Diuretics and masking agents
  {
    id: 's5-001',
    name: 'Furosemide',
    category: 'S5. Diuretics and masking agents',
    description: 'Loop diuretic that can mask other substances',
    prohibitedStatus: 'always'
  },
  {
    id: 's5-002',
    name: 'Hydrochlorothiazide',
    category: 'S5. Diuretics and masking agents',
    description: 'Thiazide diuretic',
    prohibitedStatus: 'always'
  },

  // S6. Stimulants
  {
    id: 's6-001',
    name: 'Amphetamine',
    category: 'S6. Stimulants',
    description: 'Central nervous system stimulant',
    examples: ['Dextroamphetamine', 'Lisdexamfetamine'],
    prohibitedStatus: 'in-competition'
  },
  {
    id: 's6-002',
    name: 'Cocaine',
    category: 'S6. Stimulants',
    description: 'Powerful stimulant drug',
    prohibitedStatus: 'in-competition'
  },
  {
    id: 's6-003',
    name: 'Ephedrine',
    category: 'S6. Stimulants',
    description: 'Stimulant found in some cold medications',
    prohibitedStatus: 'in-competition',
    notes: 'Prohibited when concentration exceeds 10 micrograms per milliliter in urine'
  },
  {
    id: 's6-004',
    name: 'Caffeine',
    category: 'S6. Stimulants',
    description: 'Common stimulant found in coffee, tea, and energy drinks',
    prohibitedStatus: 'in-competition',
    notes: 'Currently on monitoring program, not prohibited but monitored'
  },

  // S7. Narcotics
  {
    id: 's7-001',
    name: 'Morphine',
    category: 'S7. Narcotics',
    description: 'Opioid pain medication',
    prohibitedStatus: 'in-competition'
  },
  {
    id: 's7-002',
    name: 'Fentanyl',
    category: 'S7. Narcotics',
    description: 'Synthetic opioid pain medication',
    prohibitedStatus: 'in-competition'
  },

  // S8. Cannabinoids
  {
    id: 's8-001',
    name: 'THC (Tetrahydrocannabinol)',
    category: 'S8. Cannabinoids',
    description: 'Psychoactive component of cannabis',
    prohibitedStatus: 'in-competition'
  },
  {
    id: 's8-002',
    name: 'Synthetic cannabinoids',
    category: 'S8. Cannabinoids',
    description: 'Artificial cannabinoid compounds',
    examples: ['JWH compounds', 'CP compounds'],
    prohibitedStatus: 'in-competition'
  },

  // S9. Glucocorticoids
  {
    id: 's9-001',
    name: 'Prednisolone',
    category: 'S9. Glucocorticoids',
    description: 'Synthetic corticosteroid',
    prohibitedStatus: 'in-competition',
    notes: 'Prohibited when administered orally, rectally, intravenously or intramuscularly'
  },
  {
    id: 's9-002',
    name: 'Cortisone',
    category: 'S9. Glucocorticoids',
    description: 'Natural corticosteroid hormone',
    prohibitedStatus: 'in-competition',
    notes: 'Topical use is permitted'
  },

  // M1. Enhancement of oxygen transfer
  {
    id: 'm1-001',
    name: 'Blood doping',
    category: 'M1. Enhancement of oxygen transfer',
    description: 'Transfusion of blood or blood products',
    prohibitedStatus: 'always'
  },

  // P1. Beta-blockers (particular sports)
  {
    id: 'p1-001',
    name: 'Propranolol',
    category: 'P1. Beta-blockers',
    description: 'Beta-blocker that can reduce anxiety and tremor',
    prohibitedStatus: 'particular-sports',
    notes: 'Prohibited in archery, automobile, billiards, darts, golf, shooting, skiing/snowboarding, underwater sports'
  },
  {
    id: 'p1-002',
    name: 'Atenolol',
    category: 'P1. Beta-blockers',
    description: 'Selective beta-1 blocker',
    prohibitedStatus: 'particular-sports',
    notes: 'Prohibited in specific sports only'
  }
];

export const getSubstancesByCategory = (category: string): WADASubstance[] => {
  return wadaSubstances.filter(substance => substance.category === category);
};

export const searchSubstances = (query: string): WADASubstance[] => {
  const lowercaseQuery = query.toLowerCase();
  return wadaSubstances.filter(substance => 
    substance.name.toLowerCase().includes(lowercaseQuery) ||
    substance.description.toLowerCase().includes(lowercaseQuery) ||
    substance.examples?.some(example => example.toLowerCase().includes(lowercaseQuery))
  );
};
