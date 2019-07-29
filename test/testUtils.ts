type MockedResponse = {
  status: jest.Mock
  end: jest.Mock
  json: jest.Mock
  setHeader: jest.Mock
  writeHead: jest.Mock
}

export const makeMockResponse = (): MockedResponse => {
  const result: MockedResponse = {
    status: jest.fn(() => result),
    end: jest.fn(() => result),
    json: jest.fn(() => result),
    setHeader: jest.fn(() => result),
    writeHead: jest.fn(() => result)
  }

  return result
}
