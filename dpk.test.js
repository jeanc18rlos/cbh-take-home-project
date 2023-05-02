const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

// Mock crypto
jest.mock("crypto", () => ({
  createHash: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  digest: jest.fn().mockReturnThis().mockReturnValue("mockedHash"),
}));

describe("deterministicPartitionKey", () => {
  describe("Given a deterministicPartitionKey function", () => {
    it("should be defined", () => {
      expect(deterministicPartitionKey).toBeDefined();
    });
  });

  describe("Given an event", () => {
    describe("Given an empty event object", () => {
      it("should return hash of empty event object", () => {
        const event = {};
        const expectedHash = "mockedHash";
        expect(deterministicPartitionKey(event)).toBe(expectedHash);
      });
    });
    describe("Given an event with no partition key", () => {
      it("should return hash of event", () => {
        const event = { id: 1, type: "test" };
        const expectedHash = "mockedHash";
        expect(deterministicPartitionKey(event)).toBe(expectedHash);
      });
    });
    describe("Given an event with a partition key", () => {
      describe("Given a partition key that is a string", () => {
        it("should return given partition key", () => {
          const event = { id: 1, type: "test", partitionKey: "customKey" };
          expect(deterministicPartitionKey(event)).toBe("customKey");
        });
        it("should make sure the hash function is called with the correct input", () => {
          const event = { id: 1, type: "test" };
          const eventString = JSON.stringify(event);
          deterministicPartitionKey(event);
          expect(crypto.createHash).toHaveBeenCalledWith("sha3-512");
          expect(crypto.createHash().update).toHaveBeenCalledWith(eventString);
          expect(crypto.createHash().update().digest).toHaveBeenCalledWith(
            "hex"
          );
        });
      });

      describe("Given a partition key that is a number", () => {
        it("should convert non-string partition key to string", () => {
          const event = { id: 1, type: "test", partitionKey: 123 };
          expect(deterministicPartitionKey(event)).toBe("123");
        });
      });
      describe("Given a partition key that exceeds max length", () => {
        it("should return hash of partition key", () => {
          const longKey = "a".repeat(257);
          const event = { id: 1, type: "test", partitionKey: longKey };
          const expectedHash = "mockedHash";
          expect(deterministicPartitionKey(event)).toBe(expectedHash);
        });
      });
    });
  });

  describe("Not Given an event", () => {
    it("should return trivial partition key", () => {
      expect(deterministicPartitionKey()).toBe("0");
    });
  });
});
