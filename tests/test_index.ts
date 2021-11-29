import { expect } from "chai";
import * as JWT from "../src/index";

const key = '349jfirfjeroigjerg40g9j';

const jwt = JWT.New({
  header: { alg: "sha256" },
  payload: { aud: "everett", mykey: "test" },
  key: key
});

describe("JWT", function () {
  it("can create a new JWT", function () {
    expect(jwt.header.alg).to.equal("sha256");
    expect(jwt.payload.aud).to.equal("everett");
    expect(jwt.payload.mykey).to.equal("test");
    expect(jwt.signature).to.not.be.null;
    expect(jwt.signature).to.not.be.undefined;
  });

  it("can generate and validate a signature", function () {
    const [err, compare] = JWT.Read(jwt.toString(), key);
    expect(err).to.be.false;
    expect(compare).to.not.be.null;
    expect((compare as any).signature).to.equal(jwt.signature);
  });

  it("can validate a jwt", function() {
    const [a] = JWT.Validate(jwt, key);
    jwt.payload.aud = 'hehehe';
    const [b] = JWT.Validate(jwt, key);

    expect(a).to.be.true;
    expect(b).to.be.false;
  });
});
