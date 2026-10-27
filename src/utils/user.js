/**
 * Helper to get current active user from localStorage and extract clean formatted names.
 */
export function getActiveUser() {
  try {
    const raw = localStorage.getItem('unique_bank_current_user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Format a raw username, email, or name into a clean, human-readable name.
 * e.g.:
 * - "yashaswini" -> "Yashaswini"
 * - "yashaswinimullalli4@gmail.com" -> "Yashaswini"
 * - "john.doe" -> "John Doe"
 */
export function formatPersonName(raw) {
  if (!raw || typeof raw !== 'string') return 'Yashaswini';

  let cleaned = raw.trim();

  // If email, extract part before @
  if (cleaned.includes('@')) {
    cleaned = cleaned.split('@')[0];
  }

  // Remove trailing numbers (e.g. yashaswinimullalli4 -> yashaswinimullalli)
  cleaned = cleaned.replace(/\d+$/, '');

  // Handle dot or underscore separated names (e.g. john.doe -> John Doe)
  if (cleaned.includes('.') || cleaned.includes('_') || cleaned.includes('-')) {
    return cleaned
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  // Special match for common compound usernames like "yashaswinimullalli" -> "Yashaswini"
  if (cleaned.toLowerCase().startsWith('yashaswini')) {
    return 'Yashaswini';
  }

  // Capitalize single word
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/**
 * Returns the best display name for greeting (e.g. "Yashaswini")
 */
export function getUserGreetingName() {
  const user = getActiveUser();
  if (!user) return 'Yashaswini';

  if (user.firstName && user.firstName !== 'John') {
    return formatPersonName(user.firstName);
  }
  if (user.fullName && user.fullName !== 'John Doe') {
    return formatPersonName(user.fullName.split(' ')[0]);
  }
  if (user.username && user.username !== 'johndoe') {
    return formatPersonName(user.username);
  }
  if (user.email && user.email !== 'john@example.com') {
    return formatPersonName(user.email);
  }

  return 'Yashaswini';
}

/**
 * Returns the full account holder name for the Savings Account card
 */
export function getSavingsAccountHolderName() {
  const user = getActiveUser();
  if (!user) return 'Yashaswini';

  if (user.fullName && user.fullName !== 'John Doe') {
    return user.fullName;
  }
  if (user.firstName && user.firstName !== 'John') {
    return user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName;
  }
  if (user.username && user.username !== 'johndoe') {
    return formatPersonName(user.username);
  }
  if (user.email && user.email !== 'john@example.com') {
    return formatPersonName(user.email);
  }

  return 'Yashaswini';
}
