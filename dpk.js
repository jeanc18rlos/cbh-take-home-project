const crypto = require('crypto');

const TRIVIAL_PARTITION_KEY = '0';
const MAX_PARTITION_KEY_LENGTH = 256;

const hash = (data) => crypto.createHash('sha3-512').update(data).digest('hex');

const getPartitionKeyFromEvent = (event) => {
  if (!event) return TRIVIAL_PARTITION_KEY;
  if (event.partitionKey) return event.partitionKey;
  return hash(JSON.stringify(event));
};

const enforceStringLength = (key) => {
  if (key.length > MAX_PARTITION_KEY_LENGTH) return hash(key);
  return key;
};

exports.deterministicPartitionKey = (event) => {
  let partitionKey = getPartitionKeyFromEvent(event);
  partitionKey = enforceStringLength(String(partitionKey));
  return partitionKey;
};