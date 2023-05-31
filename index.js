// index.js
import fs from 'fs'
import { finished } from 'stream/promises'
import { Readable } from 'stream'
import im from 'imagemagick'

const main = async () => {
    let date = new Date();
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() + (offset * 60 * 1000));
    let format = date.toISOString().split('T')[0];

    const file = await fetch(`https://static01.nyt.com/images/${format.replace(/-/g, '/')}/nytfrontpage/scan.pdf`);
    console.log('file', file);

    const fileStream = fs.createWriteStream('/tmp/image.pdf', { flags: 'wx' });

    await finished(Readable.fromWeb(file.body).pipe(fileStream));

    console.log('yes');

    im.convert([
        '/tmp/image.pdf[0]',
        '-format', 'jpg',
        '-resample', '600x600',
        '-quality', '100',
        '-strip',
        '-resize', '1440x2550',
        `./serve/images/nyt-${format}.jpg`,
    ]);

    await fs.promises.copyFile(`./serve/images/nyt-${format}.jpg`, `./serve/images/nytfrontpage.jpg`);
}


main();