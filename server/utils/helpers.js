/**
 * Extracts the domain from an email address
 * Example: "john@nyu.edu" -> "nyu.edu"
 */
export const extractDomain = (email) => {
  const match = email.match(/@(.+)$/);
  return match ? match[1].toLowerCase() : null;
};

/**
 * Validates if an email has an educational domain
 * Supports: .edu, .ac.*, .edu.*, university domains
 */
export const isEduEmail = (email) => {
  // Common educational domain patterns
  const eduPatterns = [
    /\.edu$/i,           // US universities (.edu)
    /\.ac\.[a-z]{2,}$/i, // Academic institutions (.ac.in, .ac.uk, etc.)
    /\.edu\.[a-z]{2,}$/i // Educational institutions (.edu.in, .edu.au, etc.)
  ];
  
  return eduPatterns.some(pattern => pattern.test(email));
};

/**
 * Generates a 6-digit verification code
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
