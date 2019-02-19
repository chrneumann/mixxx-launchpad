/* @flow */
import { create, LaunchpadMidiButton } from '@mixxx-launchpad/app'
import { assign } from 'lodash-es'
import pkg from './package.json'
import colors from './colors'
import buttons from './buttons'

import type { LaunchpadDevice } from '@mixxx-launchpad/app'

class LaunchpadMK2Device implements LaunchpadDevice {
  buttons: { [key: string]: LaunchpadMidiButton }
  colors: { [key: string]: number }

  constructor () {
    this.buttons = Object.keys(buttons).reduce(
      (obj, name) => assign(obj, { [name]: new LaunchpadMidiButton(buttons[name]) }), {})
    this.colors = colors
  }

  init () { }

  shutdown () { }
}

const x: string = 5

export default create(pkg.controller.global, new LaunchpadMK2Device())
