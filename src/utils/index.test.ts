import { compareStrings } from 'utils'
// write tests for the compareStrings function
describe('compareStrings', () => {
  it('should return true if strings are equal', () => {
    expect(compareStrings('hello', 'hello')).toBe(true)
  })
  it('should return false if strings are different', () => {
    expect(compareStrings('hello', 'world')).toBe(false)
  })
  it('should return true if strings are equal with dashes', () => {
    expect(compareStrings('hello-world', 'hello-world')).toBe(true)
  })
  it('should return true if strings are equal with spaces', () => {
    expect(compareStrings('hello world', 'hello world')).toBe(true)
  })
  it('should return true irrelevant 2', () => {
    expect(compareStrings('hello-world', 'hello world')).toBe(true)
  })
  it('should return true irrelevant 3', () => {
    expect(compareStrings('hello world', 'hello-world')).toBe(true)
  })
  it('should return true irrelevant 4', () => {
    expect(compareStrings('hello  world', 'hello-world ')).toBe(true)
  })
  it('should return true irrelevant 5', () => {
    expect(compareStrings('HeLlo  World', 'Hello-World ')).toBe(true)
  })
})
