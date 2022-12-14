const setCustomErrors = <
  T extends { [X in keyof T]: { code: X; message: string } }
>(
  errors: T
) => errors

export const E_CODES = setCustomErrors({
  UNKNOWN: { code: 'UNKNOWN', message: 'Unknown error' },
  U4000: {
    code: 'U4000',
    message: 'User already exists.',
  },
  U4001: {
    code: 'U4001',
    message: 'Invalid email.',
  },
  U4002: {
    code: 'U4002',
    message:
      'Invalid password. Password must contain minimum eight characters, must have at least one uppercase letter, one lowercase letter and one number',
  },
} as const)
