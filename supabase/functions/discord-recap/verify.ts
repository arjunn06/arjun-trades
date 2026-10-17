// Discord signs every request it sends. Anything that fails this check must be rejected.
// https://discord.com/developers/docs/interactions/overview#setting-up-an-endpoint-validating-security-request-headers

export interface NaClLike {
  sign: { detached: { verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean } };
}

const fromHex = (hex: string): Uint8Array => {
  if (!/^([0-9a-f]{2})+$/i.test(hex)) throw new Error("not hex");
  return Uint8Array.from(hex.match(/../g)!.map((b) => parseInt(b, 16)));
};

export const verifyDiscordSignature = (
  nacl: NaClLike,
  publicKeyHex: string,
  signatureHex: string,
  timestamp: string,
  body: string,
): boolean => {
  try {
    return nacl.sign.detached.verify(
      new TextEncoder().encode(timestamp + body),
      fromHex(signatureHex),
      fromHex(publicKeyHex),
    );
  } catch {
    return false;
  }
};
