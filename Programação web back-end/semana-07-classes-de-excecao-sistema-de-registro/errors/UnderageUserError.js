class UnderageUserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnderageUserError';
  }
}

module.exports = { UnderageUserError };
