const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");

const app = require("../server");

test("GET /health returns ok", async () => {
  const res = await request(app).get("/health");

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, "ok");
});

test("GET /users returns a list of users", async () => {
  const res = await request(app).get("/users");

  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.ok(res.body.length >= 1);
});

test("GET /users/:id returns 404 for a user that does not exist", async () => {
  const res = await request(app).get("/users/9999");

  assert.strictEqual(res.status, 404);
});

test("POST /users with no body returns 400", async () => {
  const res = await request(app).post("/users").send({});

  assert.strictEqual(res.status, 400);
});

test("GET /users/:id returns the matching user", async () => {
  const res = await request(app).get("/users/1");

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.id, 1);
  assert.strictEqual(res.body.email, "ada@example.com");
});

test("GET /users/:id returns 404 for a non-numeric id", async () => {
  const res = await request(app).get("/users/abc");

  assert.strictEqual(res.status, 404);
  assert.strictEqual(res.body.error, "User not found");
});

test("POST /users creates a user and returns 201", async () => {
  const res = await request(app)
    .post("/users")
    .send({ name: "Grace Hopper", email: "grace@example.com" });

  assert.strictEqual(res.status, 201);
  assert.strictEqual(typeof res.body.id, "number");
  assert.strictEqual(res.body.name, "Grace Hopper");
  assert.strictEqual(res.body.email, "grace@example.com");
});

test("POST /users makes the new user available from GET /users/:id", async () => {
  const created = await request(app)
    .post("/users")
    .send({ name: "Linus", email: "linus@example.com" });
  const res = await request(app).get(`/users/${created.body.id}`);

  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body, created.body);
});

test("POST /users without a name returns 400", async () => {
  const res = await request(app).post("/users").send({ email: "x@example.com" });

  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error, "name and email are required");
});

test("POST /users without an email returns 400", async () => {
  const res = await request(app).post("/users").send({ name: "No Email" });

  assert.strictEqual(res.status, 400);
});

test("POST /users with empty strings returns 400", async () => {
  const res = await request(app).post("/users").send({ name: "", email: "" });

  assert.strictEqual(res.status, 400);
});
