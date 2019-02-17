#!/usr/bin/env node

const { promisify } = require('util')
const path = require('path')
const mkdirp = promisify(require('mkdirp'))
const fs = require('fs')

const rollup = require('rollup')
const nodeResolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

if (process.argv.length !== 4) {
  throw Error('Usage: target outFile')
}

const tgt = process.argv[2]
const tgtPkg = require(path.resolve('packages', tgt, 'package.json'))
const input = path.resolve('packages', tgt, tgtPkg.main)

const global = tgtPkg.controller.global

Promise.resolve().then(async () => {
  await mkdirp(path.dirname(path.resolve(process.argv[3])))
  const cache = await readFile('tmp/cache.json').then((cache) => JSON.parse(cache)).catch((err) => null)
  const bundle = await rollup.rollup({
    cache,
    input,
    plugins: [
      nodeResolve({
        extensions: ['.js', '.json'],
        main: true,
        customResolveOptions: {
          paths: [ path.resolve('packages', tgt, 'node_modules') ]
        }}),
      json(),
      babel({
        exclude: 'node_modules/**'}),
      commonjs()]})
  await mkdirp('tmp')
  await Promise.all([
    writeFile('tmp/cache.json', JSON.stringify(bundle)),
    bundle.write({	    
      strict: false, // FIXME: see https://github.com/mixxxdj/mixxx/pull/1795#discussion_r251744258
      format: 'iife',
      name: global,
      file: path.resolve(process.argv[3])
    })])
}).catch((err) => { throw err })
