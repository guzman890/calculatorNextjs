
import { getOperations, getRecords, getOperationResult } from '../../../src/app/api/operations/index';
import { cookies } from 'next/headers';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

global.fetch = jest.fn();

describe('index.ts tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getOperations should fetch and return operations', async () => {
    const mockSession = { user: { id: 'user1' } };
    const mockToken = { token: 'token123' };
    const mockResponse = { data: 'operations' };

    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn()
        .mockReturnValueOnce({ value: JSON.stringify(mockSession) })
        .mockReturnValueOnce({ value: JSON.stringify(mockToken) }),
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await getOperations();
    expect(result).toBe(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('http://3.23.95.102/operations', {
      headers: { Authorization: 'Bearer token123' },
    });
  });

  test('getOperations should handle 400 error', async () => {
    const mockSession = { user: { id: 'user1' } };
    const mockToken = { token: 'token123' };

    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn()
        .mockReturnValueOnce({ value: JSON.stringify(mockSession) })
        .mockReturnValueOnce({ value: JSON.stringify(mockToken) }),
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 400,
      json: jest.fn().mockResolvedValue({ error: 'Bad Request' }),
    });

    try {
      await getOperations();
    } catch (error) {
      expect(error).toEqual(new Error('Bad Request'));
    }

    expect(global.fetch).toHaveBeenCalledWith('http://3.23.95.102/operations', {
      headers: { Authorization: 'Bearer token123' },
    });
  });

  test('getRecords should fetch and return records', async () => {
    const mockSession = { user: { id: 'user1' } };
    const mockToken = { token: 'token123' };
    const mockResponse = { data: 'records' };

    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn()
        .mockReturnValueOnce({ value: JSON.stringify(mockSession) })
        .mockReturnValueOnce({ value: JSON.stringify(mockToken) }),
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await getRecords(1, 10);
    expect(result).toBe(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('http://3.23.95.102/records/page?page=0&size=10&sort=date,desc', {
      headers: { Authorization: 'Bearer token123' },
    });
  });

  test('getOperationResult should fetch and return operation result', async () => {
    const mockSession = { user: { id: 'user1' } };
    const mockToken = { token: 'token123' };
    const mockResponse = { data: 'operationResult' };
    const mockUserResponse = { id: 'user1', name: 'User One' };

    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn()
        .mockReturnValueOnce({ value: JSON.stringify(mockSession) })
        .mockReturnValueOnce({ value: JSON.stringify(mockToken) }),
      set: jest.fn(),
    });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockResponse),
        status: 200,
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockUserResponse),
      });

    const result = await getOperationResult(1, 2, 'operation1');
    expect(result).toBe(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('http://3.23.95.102/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token123',
      },
      body: JSON.stringify({
        operationId: 'operation1',
        userId: 'user1',
        value: [1, 2],
      }),
    });
    expect(global.fetch).toHaveBeenCalledWith('http://3.23.95.102/users/user1', {
      headers: { Authorization: 'Bearer token123' },
    });
    expect(cookies().set).toHaveBeenCalledWith(
      'session',
      JSON.stringify({ user: mockUserResponse }),
      { httpOnly: true }
    );
  });
});