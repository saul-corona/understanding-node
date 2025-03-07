const fs = require("fs/promises");

// Memory usage: 7.9 MB
// (async () => {
//   const destFile = await fs.open("test-copy.txt", "w");
//   const result = await fs.readFile("test.txt");

//   await destFile.write(result);
// })();

// (async () => {
//   const srcFile = await fs.open("test.txt", "r");
//   const destFile = await fs.open("test-copy.txt", "w");

//   let bytesRead = -1;

//   while (bytesRead !== 0) {
//     const readResult = await srcFile.read();
//     bytesRead = readResult.bytesRead;

//     if (bytesRead !== 16384) {
//       const indexOfNotFilled = readResult.buffer.indexOf(0);
//       const newBuffer = Buffer.alloc(indexOfNotFilled);
//       readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
//       destFile.write(newBuffer);
//     } else {
//       destFile.write(readResult.buffer);
//     }
//   }
// })();

(async () => {
  console.log("copying");
  const srcFile = await fs.open("test.txt", "r");
  const destFile = await fs.open("test-copy.txt", "w");

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();

  readStream.pipe(writeStream);
  console.timeEnd("copying");
})();
