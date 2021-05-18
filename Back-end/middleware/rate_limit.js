const rateLimit = require("express-rate-limit");

const AccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 10, // Bloque après 10 essais
    message:
      "Vous avez essayez de vous connecter trop de fois, réessayez dans une heure "
  });

  module.exports = AccountLimiter;