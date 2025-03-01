const tests = [
  ////////////////////////////////////////////////////////////////////////////////
  // These are inconsistent due to special-casing

  {
    'entry.js': `import * as entry from './entry.js'\ninput.works = entry.__esModule === void 0`,
  }, {
    'entry.js': `import * as entry from './entry.js'\ninput.works =\n  entry[Math.random() < 1 && '__esModule'] === void 0`,
  },

  {
    'entry.js': `import './foo.js'`,
    'foo.js': `import * as foo from './foo.js'\ninput.works = foo.__esModule === void 0`,
  }, {
    'entry.js': `import './foo.js'`,
    'foo.js': `import * as foo from './foo.js'\ninput.works =\n  foo[Math.random() < 1 && '__esModule'] === void 0`,
  },

  {
    'entry.js': `import * as foo from './foo.js'\ninput.works = foo.default === '123'`,
    'foo.js': `module.exports = '123'`,
  }, {
    'entry.js': `import * as foo from './foo.js'\ninput.works =\n  foo[Math.random() < 1 && 'default'] === '123'`,
    'foo.js': `module[Math.random() < 1 && 'exports'] = '123'`,
  },

  {
    'entry.js': `import * as foo from './foo.js'\ninput.works =\n  foo.__esModule === void 0 && foo.bar === 123`,
    'foo.js': `export let bar = 123`,
  }, {
    'entry.js': `import * as foo from './foo.js'\ninput.works =\n  foo[Math.random() < 1 && '__esModule'] === void 0 &&\n  foo.bar === 123`,
    'foo.js': `export let bar = 123`,
  },

  {
    'entry.js': `import * as foo from './foo.js'\ninput.works =\n  foo.__esModule === false && foo.default.bar === 123`,
    'foo.js': `export let __esModule = false\nexport default { bar: 123 }`,
  }, {
    'entry.js': `import * as foo from './foo.js'\ninput.works =\n  foo[Math.random() < 1 && '__esModule'] === false &&\n  foo[Math.random() < 1 && 'default'].bar === 123`,
    'foo.js': `export let __esModule = false\nexport default { bar: 123 }`,
  },

  {
    'entry.js': `import * as foo from './foo.js'\ninput.works =\n  foo.default.default.bar === 123`,
    'foo.js': `exports.__esModule = false\nexports.default = { bar: 123 }`,
  }, {
    'entry.js': `import * as foo from './foo.js'\ninput.works =\n  foo[Math.random() < 1 && 'default'].default.bar === 123`,
    'foo.js': `exports[Math.random() < 1 && '__esModule'] = false\nexports[Math.random() < 1 && 'default'] = { bar: 123 }`,
  },

  {
    'entry.js': `const foo = require('./foo.js')
import * as foo2 from './foo.js'
input.works = import('./foo.js').then(foo3 =>
  foo.bar === 123 && foo.__esModule === true &&
  foo2.bar === 123 && foo2.__esModule === void 0 &&
  foo3.bar === 123 && foo3.__esModule === void 0)`,
    'foo.js': `export let bar = 123`,
  }, {
    'entry.js': `const foo = require('./foo.js')
import * as foo2 from './foo.js'
input.works = import('./foo.js').then(foo3 =>
  foo.bar === 123 &&
  foo2.bar === 123 &&
  foo3.bar === 123 &&
  foo[Math.random() < 1 && '__esModule'] === true &&
  foo2[Math.random() < 1 && '__esModule'] === void 0 &&
  foo3[Math.random() < 1 && '__esModule'] === void 0)`,
    'foo.js': `export let bar = 123`,
  },

  ////////////////////////////////////////////////////////////////////////////////
  // These all pass

  {
    'entry.js': `const entry = require('./entry.js')\ninput.works = entry.__esModule === void 0\nexports.foo = 123`,
  }, {
    'entry.js': `const entry = require('./entry.js')\ninput.works =\n  entry[Math.random() < 1 && '__esModule'] === void 0\nexports.foo = 123`,
  },

  {
    'entry.js': `const entry = require('./entry.js')\ninput.works = entry.__esModule === true\nexport {}`,
  }, {
    'entry.js': `const entry = require('./entry.js')\ninput.works =\n  entry[Math.random() < 1 && '__esModule'] === true\nexport {}`,
  },

  {
    'entry.js': `const entry = require('./entry.js')\ninput.works = entry.__esModule === true\nexport default 123`,
  }, {
    'entry.js': `const entry = require('./entry.js')\ninput.works =\n  entry[Math.random() < 1 && '__esModule'] === true\nexport default 123`,
  },

  {
    'entry.js': `const foo = require('./foo.js')\ninput.works = foo.bar === 123 &&\n  foo.__esModule === true`,
    'foo.js': `export let bar = 123`,
  }, {
    'entry.js': `const foo = require('./foo.js')\ninput.works = foo.bar === 123 &&\n  foo[Math.random() < 1 && '__esModule'] === true`,
    'foo.js': `export let bar = 123`,
  },

  {
    'entry.js': `const foo = require('./foo.js')\ninput.works = foo.default === 123 &&\n  foo.__esModule === true`,
    'foo.js': `export default 123`,
  }, {
    'entry.js': `const foo = require('./foo.js')\ninput.works =\n  foo[Math.random() < 1 && 'default'] === 123 &&\n  foo[Math.random() < 1 && '__esModule'] === true`,
    'foo.js': `export default 123`,
  },

  {
    'entry.js': `const foo = require('./foo.js')\ninput.works = foo.baz === 123 &&\n  foo.__esModule === true`,
    'foo.js': `export * from './bar.js'`,
    'bar.js': `export let baz = 123`,
  }, {
    'entry.js': `const foo = require('./foo.js')\ninput.works = foo.baz === 123 &&\n  foo[Math.random() < 1 && '__esModule'] === true`,
    'foo.js': `export * from './bar.js'`,
    'bar.js': `export let baz = 123`,
  },

  {
    'entry.js': `import foo from './foo.js'\ninput.works = foo.default.bar === 123 &&\n  foo.bar === void 0`,
    'foo.js': `module.exports = { default: { bar: 123 } }`,
  }, {
    'entry.js': `import foo from './foo.js'\ninput.works =\n  foo[Math.random() < 1 && 'default'].bar === 123 &&\n  foo.bar === void 0`,
    'foo.js': `module[Math.random() < 1 && 'exports'] =\n  { default: { bar: 123 } }`,
  },

  {
    'entry.js': `import foo from './foo.js'\ninput.works = foo === 123`,
    'foo.js': `module.exports = 123`,
  }, {
    'entry.js': `import foo from './foo.js'\ninput.works = foo === 123`,
    'foo.js': `module[Math.random() < 1 && 'exports'] = 123`,
  },

  {
    'entry.js': `import * as foo from './foo.js'\ninput.works = foo.default.bar === 123`,
    'foo.js': `exports.__esModule = true\nexports.default = { bar: 123 }`,
  }, {
    'entry.js': `import * as foo from './foo.js'\ninput.works =\n  foo[Math.random() < 1 && 'default'].bar === 123`,
    'foo.js': `exports[Math.random() < 1 && '__esModule'] = true\nexports[Math.random() < 1 && 'default'] = { bar: 123 }`,
  },

  {
    'entry.js': `input.works = import('./foo.js')\n  .then(foo => foo.default === 123 &&\n    foo.__esModule === void 0)`,
    'foo.js': `export default 123`,
  }, {
    'entry.js': `input.works = import('./foo.js')\n  .then(foo =>\n    foo[Math.random() < 1 && 'default'] === 123 &&\n    foo[Math.random() < 1 && '__esModule'] === void 0)`,
    'foo.js': `export default 123`,
  },

  ////////////////////////////////////////////////////////////////////////////////
  // These should pass because Webpack is not following the ECMAScript standard

  {
    'entry.js': `import * as foo from './foo.js'\ninput.works = typeof foo === 'object'`,
    'foo.js': `module.exports = '123'`,
  }, {
    'entry.js': `import * as foo from './foo.js'\ninput.works = typeof foo === 'object'`,
    'foo.js': `module[Math.random() < 1 && 'exports'] = '123'`,
  },

  {
    'entry.js': `import * as foo from './foo.js'\ninput.works = foo !== '123'`,
    'foo.js': `module.exports = '123'`,
  }, {
    'entry.js': `import * as foo from './foo.js'\ninput.works = foo !== '123'`,
    'foo.js': `module[Math.random() < 1 && 'exports'] = '123'`,
  },

  ////////////////////////////////////////////////////////////////////////////////
  // These should pass but fail

  {
    'entry.js': `import * as foo from './foo.js'\ninput.works = foo.default === void 0 &&\n  foo.bar === 123`,
    'foo.js': `exports.__esModule = true\nexports.bar = 123`,
  }, {
    'entry.js': `import * as foo from './foo.js'\ninput.works =\n  foo[Math.random() < 1 && 'default'] === void 0 &&\n  foo.bar === 123`,
    'foo.js': `exports.__esModule = true\nexports.bar = 123`,
  },

  {
    'entry.js': `import * as foo from './foo.js'\ninput.works = foo.__esModule === true &&\n  foo.default.bar === 123`,
    'foo.js': `export let __esModule = true\nexport default { bar: 123 }`,
  }, {
    'entry.js': `import * as foo from './foo.js'\ninput.works =\n  foo[Math.random() < 1 && '__esModule'] === true &&\n  foo[Math.random() < 1 && 'default'].bar === 123`,
    'foo.js': `export let __esModule = true\nexport default { bar: 123 }`,
  },

  {
    'entry.js': `import * as foo from './foo.js'\ninput.works = foo.default.bar === 123`,
    'foo.js': `export let __esModule = true\nexport default { bar: 123 }`,
  }, {
    'entry.js': `import * as foo from './foo.js'\ninput.works =\n  foo[Math.random() < 1 && 'default'].bar === 123`,
    'foo.js': `export let __esModule = true\nexport default { bar: 123 }`,
  },

  {
    'entry.js': `import * as foo from './foo.js'\ninput.works = foo.default.bar === 123`,
    'foo.js': `export let __esModule = false\nexport default { bar: 123 }`,
  }, {
    'entry.js': `import * as foo from './foo.js'\ninput.works =\n  foo[Math.random() < 1 && 'default'].bar === 123`,
    'foo.js': `export let __esModule = false\nexport default { bar: 123 }`,
  },

  {
    'entry.js': `const foo = require('./foo.js')\ninput.works = foo.__esModule === true`,
    'foo.js': `export let __esModule = 0`,
  }, {
    'entry.js': `const foo = require('./foo.js')\ninput.works =\n  foo[Math.random() < 1 && '__esModule'] === true`,
    'foo.js': `export let __esModule = 0`,
  },

  {
    'entry.js': `import foo from './foo.js'\ninput.works = foo === void 0`,
    'foo.js': `module.exports = { bar: 123, __esModule: true }`,
  }, {
    'entry.js': `import foo from './foo.js'\ninput.works = foo === void 0`,
    'foo.js': `module[Math.random() < 1 && 'exports'] =\n  { bar: 123, __esModule: true }`,
  },

  {
    'entry.js': `import foo from './foo.cjs'\ninput.works = foo.default.bar === 123`,
    'foo.cjs': `module.exports = {\n  default: { bar: 123 }, __esModule: true }`,
    'package.json': `{ "type": "module" }`,
  }, {
    'entry.js': `import foo from './foo.cjs'\ninput.works =\n  foo[Math.random() < 1 && 'default'].bar === 123`,
    'foo.cjs': `module[Math.random() < 1 && 'exports'] =\n  { default: { bar: 123 }, __esModule: true }`,
    'package.json': `{ "type": "module" }`,
  },

  {
    'entry.mjs': `import foo from './foo.js'\ninput.works = foo.default.bar === 123`,
    'foo.js': `module.exports = {\n  default: { bar: 123 }, __esModule: true }`,
  }, {
    'entry.mjs': `import foo from './foo.js'\ninput.works =\n  foo[Math.random() < 1 && 'default'].bar === 123`,
    'foo.js': `module[Math.random() < 1 && 'exports'] =\n  { default: { bar: 123 }, __esModule: true }`,
  },

  {
    'entry.mts': `import foo from './foo.js'\ninput.works = foo.default.bar === 123`,
    'foo.js': `module.exports = {\n  default: { bar: 123 }, __esModule: true }`,
  }, {
    'entry.mts': `import foo from './foo.js'\ninput.works =\n  foo[Math.random() < 1 && 'default'].bar === 123`,
    'foo.js': `module[Math.random() < 1 && 'exports'] =\n  { default: { bar: 123 }, __esModule: true }`,
  },

  {
    'entry.js': `import * as ns from './foo.js'\nlet keys = Object.keys(ns)\ninput.works = ns.foo === 123 &&\n  keys.includes('foo') && !keys.includes('default')`,
    'foo.js': `exports.__esModule = true\nexports.foo = 123`,
  }, {
    'entry.js': `import * as ns from './foo.js'\nlet keys = Object.keys(ns)\ninput.works = ns.foo === 123 &&\n  keys.includes('foo') && !keys.includes('default')`,
    'foo.js': `exports[Math.random() < 1 && '__esModule'] = true\nexports[Math.random() < 1 && 'foo'] = 123`,
  },

  {
    'entry.js': `import * as ns from './foo.js'\ninput.works = ns.foo === 123 &&\n  {}.hasOwnProperty.call(ns, 'foo') &&\n  !{}.hasOwnProperty.call(ns, 'default')`,
    'foo.js': `exports.__esModule = true\nexports.foo = 123`,
  }, {
    'entry.js': `import * as ns from './foo.js'\ninput.works = ns.foo === 123 &&\n  {}.hasOwnProperty.call(ns, 'foo') &&\n  !{}.hasOwnProperty.call(ns, 'default')`,
    'foo.js': `exports[Math.random() < 1 && '__esModule'] = true\nexports[Math.random() < 1 && 'foo'] = 123`,
  },

  {
    'entry.js': `import * as ns from './foo.js'\nlet keys = Object.keys(ns)\ninput.works =\n  ns.default === 123 && !keys.includes('default')`,
    'foo.js': `exports.__esModule = true\nObject.defineProperty(exports,\n  'default', { value: 123 })`,
  }, {
    'entry.js': `import * as ns from './foo.js'\nlet keys = Object.keys(ns)\ninput.works =\n  ns.default === 123 && !keys.includes('default')`,
    'foo.js': `exports[Math.random() < 1 && '__esModule'] = true\nObject.defineProperty(exports,\n  Math.random() < 1 && 'default', { value: 123 })`,
  },

  {
    'entry.js': `import * as ns from './foo.js'\nlet keys = Object.keys(ns)\ninput.works =\n  ns.default === 123 && keys.includes('default')`,
    'foo.js': `exports.__esModule = true\nObject.defineProperty(exports, 'default',\n  { value: 123, enumerable: true })`,
  }, {
    'entry.js': `import * as ns from './foo.js'\nlet keys = Object.keys(ns)\ninput.works =\n  ns.default === 123 && keys.includes('default')`,
    'foo.js': `exports[Math.random() < 1 && '__esModule'] = true\nObject.defineProperty(exports, Math.random() < 1 && 'default',\n  { value: 123, enumerable: true })`,
  },
]

const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const esbuild = require('esbuild')
const parcel = require('@parcel/core')
const rollup = require('rollup')
const child_process = require('child_process')
const pluginNodeResolve = require('@rollup/plugin-node-resolve')
const pluginCommonJS = require('@rollup/plugin-commonjs')

const bundlers = {
  async webpack({ entryFile, inDir, outDir }) {
    let err = await new Promise(resolve => webpack({
      entry: path.join(inDir, entryFile),
      output: {
        path: outDir,
        filename: entryFile,
      },
      plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1
        }),
      ],
    }, (err, stats) => {
      if (!err && stats.hasErrors()) err = stats.toJson().errors[0]
      resolve(err)
    }))
    if (!err) {
      try {
        const input = {}
        new Function('input', fs.readFileSync(path.join(outDir, entryFile), 'utf8'))(input)
        if (!await input.works) throw new Error('Test did not pass')
      } catch (e) {
        err = e
      }
    }
    return err
  },

  async esbuild({ entryFile, inDir, outDir }) {
    let err
    try {
      const outfile = path.join(outDir, entryFile)
      await esbuild.build({
        entryPoints: [path.join(inDir, entryFile)],
        bundle: true,
        outfile,
        logLevel: 'silent',
      })
      const input = {}
      new Function('input', fs.readFileSync(outfile, 'utf8'))(input)
      if (!await input.works) throw new Error('Test did not pass')
    } catch (e) {
      if (e && e.errors && e.errors[0]) e = new Error(e.errors[0].text)
      err = e
    }
    return err
  },

  async parcel({ entryFile, inDir, outDir }) {
    let err
    try {
      // Prevent parcel from messing with the console
      require('@parcel/logger').patchConsole = () => 0
      require('@parcel/logger').unpatchConsole = () => 0
      await new parcel.default({
        entries: path.join(inDir, entryFile),
        defaultConfig: require.resolve('@parcel/config-default'),
        defaultTargetOptions: {
          distDir: outDir,
        },
      }).run()
      const input = {}
      const globalObj = {} // Prevent parcel from messing with the global object
      new Function('input', 'globalThis', 'self', 'window', 'global',
        fs.readFileSync(path.join(outDir, entryFile), 'utf8'))(
          input, globalObj, globalObj, globalObj, globalObj)
      if (!await input.works) throw new Error('Test did not pass')
    } catch (e) {
      err = e
    }
    return err
  },

  async rollup({ entryFile, inDir, outDir }) {
    let err
    try {
      const bundle = await rollup.rollup({
        input: path.join(inDir, entryFile),
        onwarn: x => { throw new Error(x) },
        plugins: [
          pluginNodeResolve.default({
            browser: true,
          }),
          pluginCommonJS(),
        ],
      })
      const file = path.join(outDir, entryFile)
      await bundle.write({
        format: 'iife',
        name: 'name',
        file,
      })
      const input = {}
      new Function('input', fs.readFileSync(file, 'utf8'))(input)
      if (!await input.works) throw new Error('Test did not pass')
    } catch (e) {
      err = e
    }
    return err
  },

  async node({ entryFile, inDir }) {
    const child = child_process.spawn(process.execPath, ['--no-warnings', '--loader', './node-test-loader.mjs', path.join(inDir, entryFile)]);

    let stderr = '';
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', data => stderr += data);

    let stdout = '';
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', data => stdout += data);

    const code = await new Promise(resolve => child.on('close', resolve));

    if (code === 0) {
      if (stdout !== 'SUCCESS\n')
        return stdout;
    }
    else {
      return stderr;
    }
  },
}

function setup({ test, inDir }) {
  fs.mkdirSync(inDir, { recursive: true })

  for (const file in test) {
    const absFile = path.join(inDir, file)
    fs.mkdirSync(path.dirname(absFile), { recursive: true })
    fs.writeFileSync(absFile, test[file])
  }
}

async function run() {
  const testCasesDir = path.join(__dirname, 'cases')
  const parcelCacheDir = path.join(__dirname, '.parcel-cache')
  const results = []
  let counter = 0

  fs.rmSync(testCasesDir, { recursive: true, force: true })

  for (const test of tests) {
    const index = counter++
    const inDir = path.join(testCasesDir, `${index}`, 'in')

    console.log(`Test ${index}:`)
    console.log(`  Files:`)
    for (const file in test) {
      console.log(`    ${file}:\n      ${test[file].split('\n').join('\n      ')}`)
    }

    const entryFile = Object.keys(test)[0]
    const result = { test }

    for (const bundler in bundlers) {
      const outDir = path.join(testCasesDir, `${index}`, `out-${bundler}`)
      fs.rmSync(parcelCacheDir, { recursive: true, force: true })
      setup({ test, inDir })

      const err = await bundlers[bundler]({ entryFile, inDir, outDir })
      console.log(`  ${bundler}: ${err ? `🚫 ${err && err.message || err}`.split('\n').join('\n    ') : '✅'}`)
      result[bundler] = !err
    }

    results.push(result)
  }

  fs.rmSync(parcelCacheDir, { recursive: true, force: true })

  const sortedBundlers = Object.keys(bundlers).map(bundler => {
    let count = 0
    for (const result of results)
      if (result[bundler])
        count++
    return { bundler, count }
  }).sort((a, b) => b.count - a.count).map(({ bundler }) => bundler)

  const printTable = results => {
    text += `<table>\n`
    text += `<tr><th>Test</th>`
    for (const bundler of sortedBundlers) {
      text += `<th>${bundler}</th>`
    }
    text += `</tr>\n`
    const counts = {}
    for (let i = 0; i < results.length; i += 2) {
      text += `<tr><td>Direct:<pre>`
      for (const file in results[i + 0].test) {
        text += `${file}:\n  ${results[i + 0].test[file].replace(/\n/g, '\n  ')}\n`
      }
      text += `</pre>Indirect:<pre>`
      for (const file in results[i + 1].test) {
        text += `${file}:\n  ${results[i + 1].test[file].replace(/\n/g, '\n  ')}\n`
      }
      text += `</pre></td>\n`
      for (const bundler of sortedBundlers) {
        text += `<td>`
        text += `${bundler}<br>${results[i + 0][bundler] ? '✅' : '🚫'}`
        text += `<br><br>`
        text += `${bundler}<br>${results[i + 1][bundler] ? '✅' : '🚫'}`
        text += `</td>\n`
        if (results[i + 0][bundler]) counts[bundler] = (counts[bundler] | 0) + 1
        if (results[i + 1][bundler]) counts[bundler] = (counts[bundler] | 0) + 1
      }
      text += `</tr>\n`
    }
    text += `<tr><td>Percent handled:</td>\n`
    for (const bundler of sortedBundlers) {
      text += `<td>${(counts[bundler] / results.length * 100).toFixed(1)}%</td>\n`
    }
    text += `</tr>\n`
    text += `</table>\n\n`
  }

  const readmePath = path.join(__dirname, 'README.md')
  const readmeText = fs.readFileSync(readmePath, 'utf8')
  const index = readmeText.indexOf('## Results')
  let text = readmeText.slice(0, index)

  text += `## Results\n\n`
  printTable(results)

  const maxWidth = Math.max(...sortedBundlers.map(x => x.length))
  text += `## Visual summary\n\n<pre>\n`
  console.log(`Visual summary:`)
  for (const bundler of sortedBundlers) {
    let summary = `${bundler}: `.padEnd(maxWidth + 2, ' ')
    for (let i = 0; i < results.length; i += 2) {
      summary += results[i + 0][bundler] ? '✅' : '🚫'
      summary += results[i + 1][bundler] ? '✅' : '🚫'
      summary += ' '
    }
    summary = summary.trim()
    console.log(`  ${summary}`)
    text += `${summary}\n`
  }
  text += `</pre>\n`

  fs.writeFileSync(readmePath, text)
}

run()
