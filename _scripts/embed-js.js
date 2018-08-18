const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const argv = require('minimist')(process.argv.slice(2), {
  // boolean: [
  //   'compress',
  // ],
  // string: [
  //   'output',
  //   'o',
  //   'out',
  // ],
  // alias: {
  //   'output': [
  //     'o',
  //     'out',
  //   ],
  // },
  // default: {
  //   'output': null,
  // },
});

argv._.forEach((file) => {
  const html = fs.readFileSync(file);
  const dom = (new JSDOM(html))
  const document = dom.window.document;
  Array.from(document.querySelectorAll('link[href]')).forEach((css) => {
    const src = css.getAttribute('href');
    if (src.indexOf('cdnjs.cloudflare.com') >= 0) return;
    if (src.indexOf('unpkg.com') >= 0) return;
    if (src.indexOf('rawgit.com') >= 0) return;
    const cssSrc = fs.readFileSync(path.join(...src.replace(/^http[s]{0,1}\:\/\/[^/]+\//, './_site/').split('/'))).toString();
    css.outerHTML = '<style>'+cssSrc+'</style>';
  });
  Array.from(document.querySelectorAll('script')).forEach((js) => {
    const src = js.getAttribute('src');
    if (src === null) return;
    if (src.indexOf('cdnjs.cloudflare.com') >= 0) return;
    if (src.indexOf('unpkg.com') >= 0) return;
    if (src.indexOf('rawgit.com') >= 0) return;
    const jsSrc = fs.readFileSync(path.join(...src.replace(/^http[s]{0,1}\:\/\/[^/]+\//, './_site/').split('/'))).toString();
    js.outerHTML = '<script>'+jsSrc+'</script>';
  });
  fs.writeFileSync(file, dom.serialize());
});
