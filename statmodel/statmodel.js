const Math = require('Math');

exports.polyRegModel = function (year) {
  pred = -1507.45833 * (year ** 2) + 6090341.29 * year + (-6145929906.425936);
  pred = Math.round(pred);
  return pred
}
