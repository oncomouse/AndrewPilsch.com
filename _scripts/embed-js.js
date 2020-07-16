const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const {execSync} = require('child_process');
const {JSDOM} = require('jsdom');
const argv = require('minimist')(process.argv.slice(2), {
  boolean: [
    'inline',
    'delete',
  ],
  default: {
    'inline': false,
    'delete': false,
  },
});
const disallowedList = [
  'imagesloaded',
];
const jekyllConfig = yaml.safeLoad(fs.readFileSync('./_config.yml'))
const checkDisallowedList = src => disallowedList.reduce((acc, cur) => acc || src.indexOf(cur) >= 0, false);
// Use with --inline to replace inclusions with their file source
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)
const gitRevision = execSync('git rev-parse HEAD').toString().replace(/\n/g, '');
const processInclude = (el, type, files) => {
  const src = el.getAttribute(type === 'css' ? 'href' : 'src');
  if (src.indexOf('polyfill.io') >= 0) return;
  if (src.indexOf('googleapis') >= 0) return;
  if (src.indexOf('cdnjs.cloudflare.com') >= 0) return;
  if (src.indexOf('unpkg.com') >= 0) return;
  if (src.indexOf('rawgit.com') >= 0) return;
  if (src.indexOf('jsdelivr.net') >= 0) return;
  if (checkDisallowedList(src)) {
    el.parentNode.removeChild(el);
    return;
  }
  if (!files.has(src)) {
    let filePath = src
    if (has(jekyllConfig, 'url') && jekyllConfig.url.length > 0) {
      filePath = filePath.replace(jekyllConfig.url, '')
    }
    if (has(jekyllConfig, 'baseurl') && jekyllConfig.baseurl.length > 0) {
      filePath = filePath.replace(jekyllConfig.baseurl, '')
    }
    filePath = path.join('_site', filePath)
    const fileSrc = fs.readFileSync(filePath).toString();
    if (fs.existsSync(filePath) && argv.delete) {
      fs.unlinkSync(filePath)
    }
    files.addFile(src, fileSrc);
  }
  if (argv.inline) {
    // Write the file as an inline inclusion:
    el.outerHTML = (type === 'css' ? `<style>${files.getFile(src)}</style>` : `<script>${files.getFile(src)}</script>`);
  } else {
    // Remove the element from the document:
    el.parentNode.removeChild(el);
  }
}

const Files = function () {this.files = {};};
Files.prototype.addFile = function (src, fileSrc) {this.files[src] = fileSrc;};
Files.prototype.has = function (src) {return Object.prototype.hasOwnProperty.call(this.files, src);}
Files.prototype.getFile = function (src) {
  return this.files[src];
}
Files.prototype.getFiles = function (filter = undefined) {
  if (filter === undefined) return Object.values(this.files);
  return this.getNames(filter)
    .reduce((acc, cur) => ([
      ...acc,
      this.files[cur],
    ]), []);
}
Files.prototype.getNames = function (filter = undefined) {
  const keys = Object.keys(this.files);
  if (filter === undefined) return keys;
  return Object.keys(this.files)
    .filter(path => path.match(filter));
}

const files = new Files();
argv._.forEach((file) => {
  const html = fs.readFileSync(file);
  const dom = (new JSDOM(html))
  const document = dom.window.document;
  const seenCss = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).reduce((seen, el) => {
    processInclude(el, 'css', files);
    return true;
  }, false);
  const seenJs = Array.from(document.querySelectorAll('script[src]')).reduce((_seen, el) => {
    processInclude(el, 'js', files);
    return true;
  }, false);
  const absoluteUrl = file => `${has(jekyllConfig, 'url') ? jekyllConfig.url : ''}${has(jekyllConfig, 'baseurl') ? jekyllConfig.baseurl : ''}/${file}`
  if (!argv.inline) {
    // If the site had CSS assets, we write the packed CSS file:
    if (seenCss) {
      const cssPath = absoluteUrl(`packed-${gitRevision}.css`);
      document.querySelector('head').insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${cssPath}" />`);
    }
    // If the site had JS assets, we write the packed JS file:
    if (seenJs) {
      const jsPath = absoluteUrl(`packed-${gitRevision}.js`);
      document.querySelector('body').insertAdjacentHTML('beforeend', `<script src="${jsPath}" />`);
    }
  }
  fs.writeFileSync(file, dom.serialize());
});
if (!argv.inline) {
  // Write the packed CSS file:
  fs.writeFileSync(
    path.join('_site', `packed-${gitRevision}.css`),
    files.getFiles(/\.css$/).join(''),
  );
  // Write the packed JS file:
  fs.writeFileSync(
    path.join('_site', `packed-${gitRevision}.js`),
    files.getFiles(/\.js$/).join(''),
  );
}
