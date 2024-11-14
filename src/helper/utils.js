const formatDateForSQL = (date, withTime = false) => {
  const pad = (num) => (num < 10 ? "0" + num : num);

  let result =
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate());

  if (withTime)
    result +=
      " " +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds());

  return result;
};

module.exports = {
  formatDateForSQL,
};
