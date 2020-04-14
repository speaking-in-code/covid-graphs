// Updates our data file, stripping extraneous information to save space.
const https = require('https');
const fs = require('fs');

const dataUrl = 'https://covidtracking.com/api/states/daily.json';
const outputFile = 'src/assets/daily.json';
const tmpFile = 'src/assets/.daily.json.tmp';
console.log(`Starting download from ${dataUrl}...`);
https.request(dataUrl, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Download from ${dataUrl} failed: ${res.statusCode} ${res.statusMessage}`);
    process.exit(1);
  }
  let rawData = '';
  res.on('data', (chunk) => {
    rawData += chunk;
  });
  res.on('end', () => {
    console.log(`Read ${rawData.length} bytes, generating data...`);
    try {
      input = JSON.parse(rawData);
      output = [];
      for (obj of input) {
        let trimmed = {
          date: obj.date,
          positive: obj.positive,
          negative: obj.negative,
          death: obj.death,
          state: obj.state,
        };
        output.push(trimmed);
      }
      outStr = JSON.stringify(output, null, 2);
      console.log(`Data is ${outStr.length} bytes, writing file...`);
      fs.writeFileSync(tmpFile, outStr);
      fs.renameSync(tmpFile, outputFile);
      console.log(`Regenerated ${outputFile}. We're done here.`);
      process.exit(0);
    } catch (e) {
      console.error(`Error generating ${outputFile}: ${e.message}`);
      process.exit(1);
    }
  });
}).on('error', (e) => {
  console.error(`Error downloading ${dataUrl}: ${e.message}`);
  process.exit(1);
}).end();
