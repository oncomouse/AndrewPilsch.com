const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2), {
  boolean: [
    'compress',
  ],
});
const { JSDOM } = require('jsdom');
const postcss = require('postcss');
const cssnano = require('cssnano');
// Read CSS files as text:
require.extensions['.css'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
const tachyonsCSS = require('tachyons-custom/css/tachyons.css');
const tachyonsImageCSS = require('tachyons-images/css/tachyons-images.min.css');
const tachyonsBoxSizingCSS = require('tachyons-box-sizing/css/tachyons-box-sizing.min.css');
const normalizeCSS = require('normalize.css/normalize.css');

function union(a, b) {
  return a.concat(b.filter(function (item) {
    return a.indexOf(item) < 0;
  }));
}

function extractClasses(htmlFilePath) {
  const html = fs.readFileSync(htmlFilePath).toString();

  const document = (new JSDOM(html)).window.document;

  const htmlClasses = [];
  const elements = document.getElementsByTagName('*');

  Array.from(elements).forEach((element) => {
    const classes = element.className.length ? element.className.split(' ') : [];
    htmlClasses.push(
      ... classes.filter(name => name.length > 0 && htmlClasses.indexOf(name) === -1),
    );
  });
  return htmlClasses;
}

const htmlClasses = argv._.reduce((acc, cur) => union(acc, extractClasses(cur)), []);

// Use PostCSS's AST to build the list of Tachyons used in the html files:
const tachyonsAST = postcss.parse(tachyonsCSS);
const rootCSS = [];
const mediaQueries = {};
// Extract a list of all classes in Tachyons:
// const tachyonsClasses = [];
// tachyonsAST.walkRules(/^\./, (rule) => {
//   const outRule = rule.selector.replace(/\s+$/,'').replace(/^\./,'');
//   if(tachyonsClasses.indexOf(outRule) === -1) {
//     tachyonsClasses.push(outRule);
//   }
// });
// Extract a list of media queries:
tachyonsAST.walkAtRules('media', (rule) => {
  mediaQueries[rule.params] = [];
});
// Walk a filtered list of our classes and add them to the right place:
htmlClasses.forEach((cssClass) => {
  tachyonsAST.walkRules(`.${cssClass}`, (rule) => {
    if(rule.parent.type === 'root') {
      rootCSS.push(rule.toString());
    } else {
      mediaQueries[rule.parent.params].push(rule.toString());
    }
  });
});
const customCSS = `${normalizeCSS}
${tachyonsBoxSizingCSS}
${tachyonsImageCSS}
${rootCSS.join('\n')}
${Object.keys(mediaQueries).filter(x => mediaQueries[x].length !== 0).map(key => `@media ${key} {
${mediaQueries[key].join('\n')}
}`).join('\n')}`;
if(argv.compress) {
  postcss([cssnano({preset: 'default'})]).process(customCSS, { from: undefined }).then(result => console.log(result.css));
} else {
  console.log(customCSS);
}
