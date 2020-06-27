const path = require('path');
const fs = require('fs');
const sizeOf = require('image-size');
const {JSDOM} = require('jsdom');
const argv = require('minimist')(process.argv.slice(2));


argv._.forEach((file) => {
  const html = fs.readFileSync(file);
  const dom = (new JSDOM(html))
  const document = dom.window.document;

  document.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    // if (!src.match(/andrew\.pilsch\.com/)) {
    //   return;
    // }
    const imageFile = path.join('.', src.replace(/^https:\/\/andrew\.pilsch\.com\//, ''))
    if (!fs.existsSync(imageFile)) {
      return;
    }
    const dimensions = sizeOf(imageFile);
    img.setAttribute('data-src', img.src);
    img.src = 'data:image/.gif;base64,R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

    img.style = `width: ${dimensions.width}px; height: ${dimensions.height}px;`;
    img.classList.add('lazy');
  });
  fs.writeFileSync(file, dom.serialize());
});
