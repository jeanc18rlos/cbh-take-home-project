const { deterministicPartitionKey } = require('./dpk');
const crypto = require('crypto');

// Mock crypto
jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  digest: jest.fn().mockReturnThis().mockReturnValue('mockedHash'),
}));

describe('deterministicPartitionKey', () => {
  
  it('should be defined', () => {
    expect(deterministicPartitionKey).toBeDefined();
  });
  
  it('should return trivial partition key when no event is provided', () => {
    expect(deterministicPartitionKey()).toBe('0');
  });

  it('should return hash of event when no partition key is provided', () => {
    const event = { id: 1, type: 'test' };
    const expectedHash = 'mockedHash';
    expect(deterministicPartitionKey(event)).toBe(expectedHash);
  });

  it('should return given partition key when provided', () => {
    const event = { id: 1, type: 'test', partitionKey: 'customKey' };
    expect(deterministicPartitionKey(event)).toBe('customKey');
  });

  it('should convert non-string partition key to string', () => {
    const event = { id: 1, type: 'test', partitionKey: 123 };
    expect(deterministicPartitionKey(event)).toBe('123');
  });

  it('should return hash of partition key when it exceeds max length', () => {
    const longKey = 'a'.repeat(257);
    const event = { id: 1, type: 'test', partitionKey: longKey };
    const expectedHash = 'mockedHash';
    expect(deterministicPartitionKey(event)).toBe(expectedHash);
  });

  it('should ensures the hash function is called with the correct input', () => {
    const event = { id: 1, type: 'test' };
    const eventString = JSON.stringify(event);
    deterministicPartitionKey(event);
    expect(crypto.createHash).toHaveBeenCalledWith('sha3-512');
    expect(crypto.createHash().update).toHaveBeenCalledWith(eventString);
    expect(crypto.createHash().update().digest).toHaveBeenCalledWith('hex');
  });
});