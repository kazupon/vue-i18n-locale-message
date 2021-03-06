import { ExitCode } from '../../../src/commands/fails/exitcode'
import { DiffError, fail } from '../../../src/commands/fails/diff'

// -------
// mocking

// -------------------
// setup/teadown hooks

let orgExit // for process.exit mock
let spyWarn
let spyError
beforeEach(() => {
  spyWarn = jest.spyOn(global.console, 'warn')
  spyError = jest.spyOn(global.console, 'error')
  process.exit = jest.fn((code => { return 'exit!' as never })) // mock: process.exit
})

afterEach(() => {
  spyError.mockRestore()
  spyWarn.mockRestore()
  jest.clearAllMocks()
  process.exit = orgExit
})

// ----------
// test cases

test('msg params', () => {
  fail('This is an error message', null)
  expect(spyError).toHaveBeenCalledWith('This is an error message')
  expect(process.exit).toHaveBeenCalledWith(1)
})

test('err params: DiffError', () => {
  fail(null, new DiffError('This is a DiffError'))
  expect(spyWarn).toHaveBeenCalledWith('This is a DiffError')
  expect(process.exit).toHaveBeenCalledWith(ExitCode.Difference)
})

test('err params: other general error', () => {
  expect.assertions(1)

  const err = new Error('This is an general error')
  try {
    fail(null, err)
  } catch (e) {
    expect(e).toEqual(err)
  }
})
