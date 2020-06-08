const app = require("../../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);

describe("Test Entry", () => {
  it("Tests server working", done => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals(
          "Welcome To What Were the Cosmos Doing"
        );
        done();
      });
  });
  it("Tests date after today", done => {
    chai
      .request(app)
      .get("/space/2340-03-20")
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.equals("Bad Date");
        done();
      });
  });

  it("Tests random sequence", done => {
    chai
      .request(app)
      .get("/space/asdjoaisdjioasdjio")
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.equals("Bad Date");
        done();
      });
  });

  it("Tests good request", done => {
    chai
      .request(app)
      .get("/space/2000-09-29")
      .end((err, res) => {
        expect(res).to.have.status(200);
        // add to this!
        //need to check if moon, planet, asteroid info is all there for Every request
        //no need to check solar flare
        done();
      });
  });
});
