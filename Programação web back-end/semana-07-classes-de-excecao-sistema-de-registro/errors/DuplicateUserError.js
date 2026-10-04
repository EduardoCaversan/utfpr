class DuplicateUserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DuplicateUserError';
  }
}

module.exports = { DuplicateUserError };
