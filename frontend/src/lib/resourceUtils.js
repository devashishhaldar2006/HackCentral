export const DOMAINS = [
  "All",
  "AI",
  "Healthcare",
  "Fintech",
  "Cybersecurity",
  "Web Development",
  "Blockchain",
  "Education",
  "Agriculture",
  "Climate Tech",
  "Smart Cities",
];

export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

export const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };