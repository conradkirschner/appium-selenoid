const { exec } = require('child_process');

const PIDs = [];

const startUp = (port) => {
    exec('npx appium -p ' + port, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log('Successfully executed startup on port ' + port)
        console.log(`stdout: ${stdout}`);
    });
}

exports.startUp = startUp;