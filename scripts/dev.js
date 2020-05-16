const { spawn } = require('child_process');
const chalk = require('chalk');
const server = require('../server');

if (!process.env.SUDO_USER) {
  console.log('>> administrator privileges is required, please try ' + chalk.bold.yellow('sudo pooy'));
  return;
}

server().then(() => {
  spawn('npm', ['run', 'client:dev'], { stdio: 'inherit' }, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      process.exit(1);
      return;
    }
  });
});
