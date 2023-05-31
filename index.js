// index.js
import { createWriteStream } from 'fs'
import { finished } from 'stream/promises'
import { Readable } from 'stream'

const main = async () => {
  let date = new Date();
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() + (offset * 60 * 1000));
  let format = date.toISOString().split('T')[0];

  const file = await fetch(`https://static01.nyt.com/images/${format.replace(/-/g, '/')}/nytfrontpage/scan.pdf`);

  const fileStream = createWriteStream('./serve/nytfrontpage.pdf', { flags: 'wx' });

  await finished(Readable.fromWeb(file.body).pipe(fileStream));
}


main();