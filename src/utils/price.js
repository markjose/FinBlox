exports.getMidPrice = (lower, upper) => lower
  && upper
  && ((lower.price || lower) + (((upper.price || upper) - (lower.price || lower)) / 2.0));
