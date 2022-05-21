/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

import { Config } from '@jest/types';


const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
}

export default config;