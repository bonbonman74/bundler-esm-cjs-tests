const tests = [
  ////////////////////////////////////////////////////////////////////////////////
  // These are inconsistent due to special-casing

  {
    'entry.js': `import * as entry from './entry'\ninput.works = entry.__esModule === void 0`,
  }, {
    'entry.js': `import * as entry from './entry'\ninput.works =\n  entry[Math.random() < 1 && '__esModule'] === void 0`,
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
input.works =
  foo.bar === 123 && foo2.bar === 123 &&
  foo.__esModule === true &&
  foo2.__esModule === void 0`,
    'foo.js': `export let bar = 123`,
  }, {
    'entry.js': `const foo = require('./foo.js')
import * as foo2 from './foo.js'
input.works =
  foo.bar === 123 && foo2.bar === 123 &&
  foo[Math.random() < 1 && '__esModule'] === true &&
  foo2[Math.random() < 1 && '__esModule'] === void 0`,
    'foo.js': `export let bar = 123`,
  },

  ////////////////////////////////////////////////////////////////////////////////
  // These all pass

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
]

const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const esbuild = require('esbuild')
const parcel = require('@parcel/core')
const rollup = require('rollup')
const pluginNodeResolve = require('@rollup/plugin-node-resolve')
const pluginCommonJS = require('@rollup/plugin-commonjs')
const inDir = path.join(__dirname, 'in')
const outDir = path.join(__dirname, 'out')
const parcelCacheDir = path.join(__dirname, '.parcel-cache')

const bundlers = {
  webpack({ entryFile }) {
    return new Promise(resolve => webpack({
      entry: path.join(inDir, entryFile),
      output: {
        path: outDir,
        filename: 'result.js',
      },
    }, (err, stats) => {
      if (!err && stats.hasErrors()) err = stats.toJson().errors[0]
      if (!err) {
        try {
          const input = {}
          new Function('input', fs.readFileSync(path.join(outDir, 'result.js')))(input)
          if (!input.works) throw new Error('Test did not pass')
        } catch (e) {
          err = e
        }
      }
      resolve(err)
    }))
  },

  async esbuild({ entryFile }) {
    let err
    try {
      const result = await esbuild.build({
        entryPoints: [path.join(inDir, entryFile)],
        bundle: true,
        write: false,
        logLevel: 'silent',
      })
      const input = {}
      new Function('input', result.outputFiles[0].text)(input)
      if (!input.works) throw new Error('Test did not pass')
    } catch (e) {
      if (e && e.errors && e.errors[0]) e = new Error(e.errors[0].text)
      err = e
    }
    return err
  },

  async parcel({ entryFile }) {
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
        fs.readFileSync(path.join(outDir, 'result.js'), 'utf8'))(
          input, globalObj, globalObj, globalObj, globalObj)
      if (!input.works) throw new Error('Test did not pass')
    } catch (e) {
      err = e
    }
    return err
  },

  async rollup({ entryFile }) {
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
      const { output } = await bundle.generate({
        format: 'iife',
        name: 'name',
      })
      const input = {}
      new Function('input', output[0].code)(input)
      if (!input.works) throw new Error('Test did not pass')
    } catch (e) {
      err = e
    }
    return err
  },
}

function reset() {
  fs.rmSync(inDir, { recursive: true, force: true })
  fs.rmSync(outDir, { recursive: true, force: true })
  fs.rmSync(parcelCacheDir, { recursive: true, force: true })
}

function setup(test) {
  fs.mkdirSync(inDir, { recursive: true })

  for (const file in test) {
    const absFile = path.join(inDir, file)
    fs.mkdirSync(path.dirname(absFile), { recursive: true })
    fs.writeFileSync(absFile, test[file])
  }
}

async function run() {
  let counter = 0
  const results = []

  for (const test of tests) {
    console.log(`Test ${counter++}:`)
    console.log(`  Files:`)
    for (const file in test) {
      console.log(`    ${file}: ${test[file].split('\n').join('\n      ')}`)
    }

    reset()
    setup(test)
    const entryFile = Object.keys(test)[0]
    const result = { test }

    for (const bundler in bundlers) {
      const err = await bundlers[bundler]({ entryFile })
      console.log(`  ${bundler}: ${err ? `🚫 ${err && err.message || err}`.split('\n')[0] : '✅'}`)
      result[bundler] = !err
    }

    results.push(result)
  }

  reset()

  const sortedBundlers = Object.keys(bundlers).map(bundler => {
    let count = 0
    for (const result of results)
      if (result[bundler])
        count++
    return { bundler, count }
  }).sort((a, b) => b.count - a.count).map(({ bundler }) => bundler)

  const maxWidth = Math.max(...sortedBundlers.map(x => x.length))
  console.log(`Summary:`)
  for (const bundler of sortedBundlers) {
    let text = `  ${bundler}: `.padEnd(maxWidth + 4, ' ')
    for (let i = 0; i < results.length; i += 2) {
      text += results[i + 0][bundler] ? '✅' : '🚫'
      text += results[i + 1][bundler] ? '✅' : '🚫'
      text += ' '
    }
    console.log(text)
  }

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
    text += `</table>\n`
  }

  const readmePath = path.join(__dirname, 'README.md')
  const readmeText = fs.readFileSync(readmePath, 'utf8')
  const index = readmeText.indexOf('## Results')
  let text = readmeText.slice(0, index)

  text += `## Results\n\n`
  printTable(results)

  fs.writeFileSync(readmePath, text)
}

run()
