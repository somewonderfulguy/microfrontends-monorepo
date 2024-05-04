import classNames from '../classNames';

test('classNames util works', () => {
  expect(classNames('foo', 'bar')).toBe('foo bar');
  expect(classNames('foo', 'bar', 'baz')).toBe('foo bar baz');
  expect(classNames('foo', 'bar', 'baz', 'qux')).toBe('foo bar baz qux');

  expect(classNames(['foo', 'bar'])).toBe('foo bar');
  expect(classNames(['foo', 'bar'], ['baz', 'qux'])).toBe('foo bar baz qux');
  expect(classNames(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  expect(classNames(['foo', 'bar'], ['baz', 'qux'], 'quux')).toBe(
    'foo bar baz qux quux'
  );

  expect(classNames()).toBe('');
  expect(classNames([])).toBe('');
  expect(classNames([], [])).toBe('');
  expect(classNames([], undefined, null, false)).toBe('');
  expect(
    classNames('foo', undefined, null, false, 'bar', { test: 'test' })
  ).toBe('foo bar');
});
