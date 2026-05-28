// ref:
// https://github.com/uuidjs/uuid/blob/7c1ea087a8149b57380fc8bb7f68c3a215cb6e4b/src/regex.ts#L1
// https://github.com/uuidjs/uuid/blob/7c1ea087a8149b57380fc8bb7f68c3a215cb6e4b/src/validate.ts#L3-L5
import type { UUID } from 'node:crypto'

const regex =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i

/** Checks that a value is a hyphenated UUID hex string, ignoring case */
// eslint-disable-next-line import/prefer-default-export
export function validateUuid(uuid: unknown): uuid is UUID {
  return typeof uuid === 'string' && regex.test(uuid)
}
