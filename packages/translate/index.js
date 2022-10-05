const fs = require('node:fs');
const file = fs.readFileSync('./test/texts/en_US.lang', {encoding: 'utf-8'});
const lines = file.split(/\r?\n/).filter(v => !v.startsWith('#')).map(v => v.replace(/\s+#.+/g,''));
console.log(lines)