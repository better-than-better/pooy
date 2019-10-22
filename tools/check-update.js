const ora = require('ora');

module.exports = function checkUpdate() {
  const spinner = ora('check update...').start();

  return new Promise((reslove, reject) => {
    setTimeout(() => {
      spinner.stop();
      console.log('🍷 Already the latest version');
      reslove();
    }, 2000);
  });
};
