// ref:
// https://github.com/uuidjs/uuid/blob/7c1ea087a8149b57380fc8bb7f68c3a215cb6e4b/src/test/test_constants.ts

import { validateUuid } from './validateUuid'

function generateTestData() {
  const NIL = '00000000-0000-0000-0000-000000000000'
  const MAX = 'ffffffff-ffff-ffff-ffff-ffffffffffff'
  const testCases = [
    // constants
    { value: NIL, expectedValidate: true },
    { value: MAX, expectedValidate: true },

    // each version, with either all 0's or all 1's in settable bits
    {
      value: '00000000-0000-1000-8000-000000000000',
      expectedValidate: true,
    },
    {
      value: 'ffffffff-ffff-1fff-8fff-ffffffffffff',
      expectedValidate: true,
    },
    {
      value: '00000000-0000-2000-8000-000000000000',
      expectedValidate: true,
    },
    {
      value: 'ffffffff-ffff-2fff-bfff-ffffffffffff',
      expectedValidate: true,
    },
    {
      value: '00000000-0000-3000-8000-000000000000',
      expectedValidate: true,
    },
    {
      value: 'ffffffff-ffff-3fff-bfff-ffffffffffff',
      expectedValidate: true,
    },
    {
      value: '00000000-0000-4000-8000-000000000000',
      expectedValidate: true,
    },
    {
      value: 'ffffffff-ffff-4fff-bfff-ffffffffffff',
      expectedValidate: true,
    },
    {
      value: '00000000-0000-5000-8000-000000000000',
      expectedValidate: true,
    },
    {
      value: 'ffffffff-ffff-5fff-bfff-ffffffffffff',
      expectedValidate: true,
    },
    {
      value: '00000000-0000-6000-8000-000000000000',
      expectedValidate: true,
    },
    {
      value: 'ffffffff-ffff-6fff-bfff-ffffffffffff',
      expectedValidate: true,
    },
    {
      value: '00000000-0000-7000-8000-000000000000',
      expectedValidate: true,
    },
    {
      value: 'ffffffff-ffff-7fff-bfff-ffffffffffff',
      expectedValidate: true,
    },
    {
      value: '00000000-0000-8000-8000-000000000000',
      expectedValidate: true,
    },
    {
      value: 'ffffffff-ffff-8fff-bfff-ffffffffffff',
      expectedValidate: true,
    },
    { value: '00000000-0000-9000-8000-000000000000', expectedValidate: false },
    { value: 'ffffffff-ffff-9fff-bfff-ffffffffffff', expectedValidate: false },
    { value: '00000000-0000-a000-8000-000000000000', expectedValidate: false },
    { value: 'ffffffff-ffff-afff-bfff-ffffffffffff', expectedValidate: false },
    { value: '00000000-0000-b000-8000-000000000000', expectedValidate: false },
    { value: 'ffffffff-ffff-bfff-bfff-ffffffffffff', expectedValidate: false },
    { value: '00000000-0000-c000-8000-000000000000', expectedValidate: false },
    { value: 'ffffffff-ffff-cfff-bfff-ffffffffffff', expectedValidate: false },
    { value: '00000000-0000-d000-8000-000000000000', expectedValidate: false },
    { value: 'ffffffff-ffff-dfff-bfff-ffffffffffff', expectedValidate: false },
    { value: '00000000-0000-e000-8000-000000000000', expectedValidate: false },
    { value: 'ffffffff-ffff-efff-bfff-ffffffffffff', expectedValidate: false },

    // selection of normal, valid UUIDs
    {
      value: 'd9428888-122b-11e1-b85c-61cd3cbb3210',
      expectedValidate: true,
    },
    {
      value: '000003e8-2363-21ef-b200-325096b39f47',
      expectedValidate: true,
    },
    {
      value: 'a981a0c2-68b1-35dc-bcfc-296e52ab01ec',
      expectedValidate: true,
    },
    {
      value: '109156be-c4fb-41ea-b1b4-efe1671c5836',
      expectedValidate: true,
    },
    {
      value: '90123e1c-7512-523e-bb28-76fab9f2f73d',
      expectedValidate: true,
    },
    {
      value: '1ef21d2f-1207-6660-8c4f-419efbd44d48',
      expectedValidate: true,
    },
    {
      value: '017f22e2-79b0-7cc3-98c4-dc0c0c07398f',
      expectedValidate: true,
    },
    {
      value: '0d8f23a0-697f-83ae-802e-48f3756dd581',
      expectedValidate: true,
    },

    // all variant octet values
    { value: '00000000-0000-1000-0000-000000000000', expectedValidate: false },
    { value: '00000000-0000-1000-1000-000000000000', expectedValidate: false },
    { value: '00000000-0000-1000-2000-000000000000', expectedValidate: false },
    { value: '00000000-0000-1000-3000-000000000000', expectedValidate: false },
    { value: '00000000-0000-1000-4000-000000000000', expectedValidate: false },
    { value: '00000000-0000-1000-5000-000000000000', expectedValidate: false },
    { value: '00000000-0000-1000-6000-000000000000', expectedValidate: false },
    { value: '00000000-0000-1000-7000-000000000000', expectedValidate: false },
    {
      value: '00000000-0000-1000-8000-000000000000',
      expectedValidate: true,
    },
    {
      value: '00000000-0000-1000-9000-000000000000',
      expectedValidate: true,
    },
    {
      value: '00000000-0000-1000-a000-000000000000',
      expectedValidate: true,
    },
    {
      value: '00000000-0000-1000-b000-000000000000',
      expectedValidate: true,
    },
    { value: '00000000-0000-1000-c000-000000000000', expectedValidate: false },
    { value: '00000000-0000-1000-d000-000000000000', expectedValidate: false },
    { value: '00000000-0000-1000-e000-000000000000', expectedValidate: false },
    { value: '00000000-0000-1000-f000-000000000000', expectedValidate: false },

    // invalid strings
    { value: '00000000000000000000000000000000', expectedValidate: false }, // unhyphenated NIL
    { value: '', expectedValidate: false },
    { value: 'invalid uuid string', expectedValidate: false },
    {
      value: '=Y00a-f*vb*-c-d#-p00f\b-g0h-#i^-j*3&-L00k-\nl---00n-fg000-00p-00r+',
      expectedValidate: false,
    },

    // invalid types
    { value: undefined, expectedValidate: false },
    { value: null, expectedValidate: false },
    { value: 123, expectedValidate: false },
    { value: /regex/, expectedValidate: false },
    { value: new Date(0), expectedValidate: false },
    { value: false, expectedValidate: false },
  ]

  // Add NIL and MAX UUIDs with 1-bit flipped in each position
  for (let charIndex = 0; charIndex < 36; charIndex += 1) {
    // Skip hyphens and version char
    if (
      charIndex === 8 ||
      charIndex === 13 ||
      charIndex === 14 || // version char
      charIndex === 18 ||
      charIndex === 23
    ) {
      // eslint-disable-next-line no-continue
      continue
    }

    const nilChars = NIL.split('')
    const maxChars = MAX.split('')

    for (let i = 0; i < 4; i += 1) {
      // eslint-disable-next-line no-bitwise
      nilChars[charIndex] = (0x0 ^ (1 << i)).toString(16)
      // NIL UUIDs w/ a single 1-bit
      testCases.push({ value: nilChars.join(''), expectedValidate: false })

      // MAX UUIDs w/ a single 0-bit
      // eslint-disable-next-line no-bitwise
      maxChars[charIndex] = (0xf ^ (1 << i)).toString(16)
      testCases.push({ value: maxChars.join(''), expectedValidate: false })
    }
  }
  return testCases
}

describe('validateUuid', () => {
  const testCases = generateTestData()

  it.each(testCases.filter(({ expectedValidate }) => expectedValidate).map(({ value }) => value))(
    'should allow %j',
    value => {
      expect(validateUuid(value)).toBe(true)
    },
  )

  it.each(testCases.filter(({ expectedValidate }) => !expectedValidate).map(({ value }) => value))(
    'should fail %j',
    value => {
      expect(validateUuid(value)).toBe(false)
    },
  )
})
