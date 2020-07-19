import * as glob from 'glob';
import * as camelCase from 'camelcase';

const files = glob.sync('./**/*.f.js', { cwd: __dirname, ignore: './node_modules/**' });

for (let f = 0, f1 = files.length; f < f1; f++) {
 const file = files[f];
 const functionName = camelCase(file.slice(0, -5).split('/').join('_'));
 exports[functionName] = require(file);
}
