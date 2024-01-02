const convertToSignature = (signatureAsJson) => {
  let obj = JSON.parse(signatureAsJson);

  if (obj.r !== undefined) {
    obj.r = BigInt(obj.r);
  }
  if (obj.s !== undefined) {
    obj.s = BigInt(obj.s);
  }

  return obj;
};

const convertToUint8Array = (obj) => {
  const values = Object.values(obj);
  return new Uint8Array(values);
};

module.exports = { convertToSignature, convertToUint8Array };
