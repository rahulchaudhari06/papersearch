export const topics = [
  { label: "Blockchain", value: "blockchain" },
  { label: "Web3", value: "web3" },
  { label: "Smart Contracts", value: '"smart contracts"' },
  { label: "DeFi", value: '"decentralized finance"' },
  { label: "Cryptocurrency", value: "cryptocurrency" },
  {
    label: "Artificial Intelligence",
    value: '"artificial intelligence" OR AI',
  },
  { label: "Machine Learning", value: '"machine learning" OR ML' },
  { label: "Computer Science", value: '"computer science"' },
  {
    label: "Cybersecurity",
    value: "cybersecurity OR 'information security'",
  },
  { label: "Robotics", value: "robotics OR 'robot systems'" },
  { label: "Chemistry", value: "chemistry" },
  { label: "Biology", value: "biology OR 'life sciences'" },
  { label: "Physics", value: "physics" },
  { label: "Aerospace Engineering", value: "aerospace engineering" },
  { label: "Aeronautics", value: "aeronautics" },
  { label: "Space Science", value: "space science" },
  { label: "Astrophysics", value: "astrophysics" },
  { label: "Astronomy", value: "astronomy" },
  { label: "Rocket Science", value: "rocket science" },
  { label: "Mathematics", value: "mathematics" },
  { label: "Pure Mathematics", value: "pure mathematics" },
  { label: "Applied Mathematics", value: "applied mathematics" },
  { label: "Calculus", value: "calculus" },
  { label: "Linear Algebra", value: "linear algebra" },
  { label: "Discrete Mathematics", value: "discrete mathematics" },
  { label: "Statistics", value: "statistics" },
  { label: "Probability Theory", value: "probability theory" },
  { label: "Number Theory", value: "number theory" },
  { label: "Differential Equations", value: "differential equations" },
  { label: "Geometry", value: "geometry" },
];

export const getTopicLabels = () => {
  return topics.map((topic) => topic.label);
};

export default topics;
