import * as crypto from "crypto";
import base64url from "base64url";
import { JWTRegisteredClaimNames, JWSRegisteredHeaderParameters } from "./base";

interface JSONWebTokenConstructor {
  key?: string;
  header: JWSRegisteredHeaderParameters;
  payload: JWTRegisteredClaimNames;
}

class JSONWebToken {
  readonly header: JWSRegisteredHeaderParameters;
  readonly payload: JWTRegisteredClaimNames;
  readonly signature?: string;

  constructor(opts: JSONWebTokenConstructor) {
    this.header = opts.header;
    this.payload = opts.payload;
    
    if (opts.key)
        this.signature = Sign(this, opts.key);
  }

  toString(): string {
    const headerString = JSON.stringify(this.header);
    const payloadString = JSON.stringify(this.payload);

    const headerBase64 = base64url(headerString);
    const payloadBase64 = base64url(payloadString);

    return `${headerBase64}.${payloadBase64}.${this.signature}`;
  }
}

function New(opts: JSONWebTokenConstructor): JSONWebToken {
  return new JSONWebToken(opts);
}

function Read(jwtstr: string, key: string): [boolean, JSONWebToken | null] {
  const [headerBase64, payloadBase64, signature] = jwtstr.split(".");

  if (!headerBase64 || !payloadBase64 || !signature) return [true, null];

  const headerString = base64url.decode(headerBase64);
  const payloadString = base64url.decode(payloadBase64);

  const header = JSON.parse(headerString);
  const payload = JSON.parse(payloadString);

  const jwt = New({ header, payload, key });

  if (jwt.signature !== signature) return [true, null];

  return [false, jwt];
}

function Validate(jwt: JSONWebToken, key: string): [boolean, JSONWebToken] {
  const expirationDate = jwt.payload.exp;
  const notBefore = jwt.payload.nbf;
  const issuedAt = jwt.payload.iat;
  const signature = jwt.signature;
  const now = Date.now();
  const check = Sign(jwt, key);

  if (issuedAt && issuedAt > now) return [false, jwt];
  if (notBefore && now < notBefore) return [false, jwt];
  if (expirationDate && expirationDate < now) return [false, jwt];
  if (!signature) return [false, jwt];
  if (check !== signature) return [false, jwt];

  return [true, jwt];
}

function Sign(jwt: JSONWebToken, key: string) {
  const headerString = JSON.stringify(jwt.header);
  const payloadString = JSON.stringify(jwt.payload);

  const headerBase64 = base64url(headerString);
  const payloadBase64 = base64url(payloadString);

  const toSign = `${headerBase64}.${payloadBase64}`;

  return crypto
    .createHmac(jwt.header.alg, key)
    .update(toSign)
    .digest("base64");
}

export { New, Read, Validate, Sign };
