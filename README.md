# ejmorgan-auth

A simple implementation of the JWT rfc spec.

## Usage

```javascript
const JWT = require("ejmorgan-auth");

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

console.log(jwt.toString());
// eyJhbGciOiJzaGEyNTYifQ.eyJhdWQiOiJhdWRpZW5jZSIsImN1c3RvbSI6Im15LWtleSJ9.bY7PCElW5f245tSaLVkiGIfLBISU7kdyfCniJ62FsDM=
```
