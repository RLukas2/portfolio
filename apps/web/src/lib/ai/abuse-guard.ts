/**
 * AI Abuse Guard
 *
 * Validates and sanitizes AI chat requests to prevent abuse and excessive token usage.
 * Only used for AI API endpoints.
 */

export interface AbuseGuardConfig {
  maxHistoryLength: number;
  maxMessageLength: number;
  maxTotalTokens?: number; // Optional: estimate based on message length
}

export interface ValidationResult {
  details?: string;
  error?: string;
  valid: boolean;
}

/**
 * Default configuration for AI chat
 */
export const chatAbuseConfig: AbuseGuardConfig = {
  maxMessageLength: 2000, // 2000 characters per message
  maxHistoryLength: 50, // Max 50 messages in history
  maxTotalTokens: 100_000, // Rough estimate: ~25k words
};

/**
 * Validate message array for abuse patterns
 */
export function validateMessages(messages: unknown, config: AbuseGuardConfig): ValidationResult {
  // Check if messages is an array
  if (!Array.isArray(messages)) {
    return {
      valid: false,
      error: 'Invalid request: messages must be an array',
    };
  }

  // Check history length
  if (messages.length > config.maxHistoryLength) {
    return {
      valid: false,
      error: 'Message history too long',
      details: `Maximum ${config.maxHistoryLength} messages allowed, received ${messages.length}`,
    };
  }

  // Check if messages array is empty
  if (messages.length === 0) {
    return {
      valid: false,
      error: 'Invalid request: messages array cannot be empty',
    };
  }

  let totalLength = 0;

  // Validate each message
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];

    // Check message structure
    if (typeof message !== 'object' || message === null) {
      return {
        valid: false,
        error: 'Invalid message format',
        details: `Message at index ${i} must be an object`,
      };
    }

    // Check required fields
    if (!('role' in message && 'content' in message)) {
      return {
        valid: false,
        error: 'Invalid message format',
        details: `Message at index ${i} must have 'role' and 'content' fields`,
      };
    }

    // Validate role
    const validRoles = ['user', 'assistant', 'system'];
    if (!validRoles.includes(message.role as string)) {
      return {
        valid: false,
        error: 'Invalid message role',
        details: `Message at index ${i} has invalid role: ${message.role}. Must be one of: ${validRoles.join(', ')}`,
      };
    }

    // Validate content
    if (typeof message.content !== 'string') {
      return {
        valid: false,
        error: 'Invalid message content',
        details: `Message at index ${i} content must be a string`,
      };
    }

    // Check individual message length
    if (message.content.length > config.maxMessageLength) {
      return {
        valid: false,
        error: 'Message too long',
        details: `Message at index ${i} exceeds maximum length of ${config.maxMessageLength} characters`,
      };
    }

    // Check for empty content
    if (message.content.trim().length === 0) {
      return {
        valid: false,
        error: 'Empty message content',
        details: `Message at index ${i} has empty content`,
      };
    }

    totalLength += message.content.length;
  }

  // Check total token estimate
  if (config.maxTotalTokens && totalLength > config.maxTotalTokens) {
    return {
      valid: false,
      error: 'Total message length too long',
      details: `Total length of ${totalLength} characters exceeds maximum of ${config.maxTotalTokens}`,
    };
  }

  return { valid: true };
}

/**
 * Sanitize message content to prevent injection attacks
 */
export function sanitizeMessage(content: string): string {
  return (
    content
      .trim()
      // Remove potential prompt injection patterns
      .replace(/```[\s\S]*?```/g, (match) => {
        // Keep code blocks but sanitize them
        return match.replace(/[<>]/g, '');
      })
      // Remove HTML-significant characters outside code blocks
      .replace(/[<>]/g, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Sanitize all messages in an array
 */
export function sanitizeMessages(
  messages: Array<{ role: string; content: string }>,
): Array<{ role: string; content: string }> {
  return messages.map((message) => ({
    ...message,
    content: sanitizeMessage(message.content),
  }));
}

/**
 * Suspicious patterns that might indicate abuse
 */
const SUSPICIOUS_PATTERNS = [
  // Prompt injection attempts
  /ignore (previous|all|above) (instructions|prompts)/i,
  /you are now/i,
  /new (instructions|system prompt)/i,
  /disregard (previous|all|above)/i,

  // Excessive repetition
  /(.{10,})\1{5,}/,

  // Excessive special characters
  /[!@#$%^&*()]{20,}/,
];

/**
 * Check for suspicious patterns that might indicate abuse
 */
export function detectSuspiciousPatterns(messages: Array<{ role: string; content: string }>): ValidationResult {
  for (let i = 0; i < messages.length; i++) {
    const content = messages[i].content;

    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(content)) {
        return {
          valid: false,
          error: 'Suspicious content detected',
          details: `Message at index ${i} contains potentially malicious patterns`,
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Complete validation pipeline for AI chat requests
 */
export function validateChatRequest(
  messages: unknown,
  config: AbuseGuardConfig = chatAbuseConfig,
  options: {
    checkSuspiciousPatterns?: boolean;
    sanitize?: boolean;
  } = {},
): ValidationResult & { sanitizedMessages?: Array<{ role: string; content: string }> } {
  // Basic validation
  const basicValidation = validateMessages(messages, config);
  if (!basicValidation.valid) {
    return basicValidation;
  }

  const typedMessages = messages as Array<{ role: string; content: string }>;

  // Check for suspicious patterns
  if (options.checkSuspiciousPatterns) {
    const suspiciousCheck = detectSuspiciousPatterns(typedMessages);
    if (!suspiciousCheck.valid) {
      return suspiciousCheck;
    }
  }

  // Sanitize if requested
  if (options.sanitize) {
    return {
      valid: true,
      sanitizedMessages: sanitizeMessages(typedMessages),
    };
  }

  return { valid: true };
}
