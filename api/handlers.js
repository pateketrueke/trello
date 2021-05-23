module.exports = Grown => {
  return Grown('Handlers', {
    include: [
      Grown.load(`${__dirname}/controllers`),
    ],
  });
};
