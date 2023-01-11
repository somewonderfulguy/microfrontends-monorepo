const mockConsole = () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation()
  const consoleLog = jest.spyOn(console, 'log').mockImplementation()
  const consoleDir = jest.spyOn(console, 'dir').mockImplementation()

  return { consoleError, consoleLog, consoleDir }
}

export type SpyConsoles = { consoleError: jest.SpyInstance, consoleLog: jest.SpyInstance, consoleDir: jest.SpyInstance }

const clearConsoleMocks = ({ consoleError, consoleLog, consoleDir }: SpyConsoles) => {
  consoleError.mockRestore()
  consoleLog.mockRestore()
  consoleDir.mockRestore()
}

const checkConsoleLogging = ({
  consoleError, consoleLog, consoleDir, errorMsg, componentName, expectedPattern,
}: SpyConsoles & { errorMsg: string, componentName: string, expectedPattern: RegExp }) => {
  expect(consoleError).toHaveBeenCalledTimes(2)
  expect(consoleError.mock.calls[0][0]).toMatch(new RegExp(errorMsg, 'i'))
  expect(consoleError.mock.calls[1][0]).toMatch(new RegExp(`The above error occurred in the <${componentName}> component`, 'i'))
  expect(consoleLog).toHaveBeenCalledTimes(1)
  expect(consoleLog.mock.lastCall[0]).toMatch(expectedPattern)
  expect(consoleDir).toHaveBeenCalledTimes(2)
  expect(consoleDir.mock.calls[0][0].toString()).toBe(`Error: ${errorMsg}`)
  expect(consoleDir.mock.calls[1][0]).toMatch(new RegExp(`at ${componentName}`, 'i'))
}

export { mockConsole, clearConsoleMocks, checkConsoleLogging }