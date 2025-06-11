const borrowLogger = (req, res, next) => {
  if (req.method === 'POST' && req.path.startsWith('/api/books/borrow')) {
    const userId = req.user ? req.user._id : 'Unknown user';
    const bookId = req.params.bookId || 'Unknown book';
    console.log(`Borrow event: User ${userId} is borrowing Book ${bookId} at ${new Date().toISOString()}`);
  }
  next();
};

module.exports = borrowLogger;
