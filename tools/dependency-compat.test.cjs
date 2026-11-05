const assert = require('node:assert/strict');
const test = require('node:test');
const { promisify } = require('node:util');
const parse = promisify(require('csv-parse').parse);

test('bulk badge CSV parsing preserves headers, quoted commas and CRLF', async () => {
  const rows = await parse('tc_handle,badge_id,awarded_by\r\ntester,badge-1,"Admin, Example"\r\n', { columns: true });
  assert.deepEqual(rows, [{ tc_handle: 'tester', badge_id: 'badge-1', awarded_by: 'Admin, Example' }]);
});

test('CSV column names cannot replace a record prototype', async () => {
  const rows = await parse('__proto__,constructor,tc_handle,badge_id\npolluted,replaced,tester,badge-1\n', { columns: true });
  assert.equal(Object.getPrototypeOf(rows[0]), Object.prototype);
  assert.equal(Object.hasOwn(rows[0], '__proto__'), true);
  assert.equal(rows[0].__proto__, 'polluted');
  assert.equal(rows[0].constructor, 'replaced');
  assert.equal(rows[0].tc_handle, 'tester');
  assert.equal({}.polluted, undefined);
});
