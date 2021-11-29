# ejmorgan-auth

A simple implementation of the JWT rfc spec.

## Usage

```javascript
const JWT = require("./dist/index");

const jwt = JWT.New({
  key: 'my-key',
  header: {
    alg: "sha256",
  },
  payload: {
    aud: "audience",
    custom: "my-key",
  },
});

const str = jwt.toString();

console.log(str);
// eyJhbGciOiJzaGEyNTYifQ.eyJhdWQiOiJhdWRpZW5jZSIsImN1c3RvbSI6Im15LWtleSJ9.bY7PCElW5f245tSaLVkiGIfLBISU7kdyfCniJ62FsDM=

const [err, ajwt]= JWT.Read(str, 'my-key');

console.log(ajwt);
// JSONWebToken {
//  header: { alg: 'sha256' },
//  payload: { aud: 'audience', custom: 'my-key' },
//  signature: 'bY7PCElW5f245tSaLVkiGIfLBISU7kdyfCniJ62FsDM='
// }

ajwt.payload.aud = 'hehehe';

const ok = JWT.Validate(ajwt, 'my-key');

console.log(ok);
// false
```