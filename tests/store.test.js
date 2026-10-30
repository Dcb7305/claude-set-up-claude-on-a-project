const test = require("node:test");
const assert = require("node:assert");

const store = require("../db/store");

test("getAllUsers returns the seeded users", () => {
  const users = store.getAllUsers();

  assert.ok(Array.isArray(users));
  assert.ok(users.length >= 2);
  assert.strictEqual(users[0].name, "Ada Lovelace");
});

test("getUserById returns the matching user", () => {
  const user = store.getUserById(1);

  assert.strictEqual(user.id, 1);
  assert.strictEqual(user.email, "ada@example.com");
});

test("getUserById returns undefined for an unknown id", () => {
  assert.strictEqual(store.getUserById(9999), undefined);
});

test("getUserById does not match string ids", () => {
  // Store IDs are numbers, so routes must convert before calling the store
  assert.strictEqual(store.getUserById("1"), undefined);
});

test("createUser returns the new user with an id", () => {
  const user = store.createUser({ name: "Grace Hopper", email: "grace@example.com" });

  assert.strictEqual(typeof user.id, "number");
  assert.strictEqual(user.name, "Grace Hopper");
  assert.strictEqual(user.email, "grace@example.com");
});

test("createUser adds the user so it can be found again", () => {
  const created = store.createUser({ name: "Linus", email: "linus@example.com" });

  assert.deepStrictEqual(store.getUserById(created.id), created);
  assert.ok(store.getAllUsers().includes(created));
});

test("createUser gives each user a unique, increasing id", () => {
  const first = store.createUser({ name: "One", email: "one@example.com" });
  const second = store.createUser({ name: "Two", email: "two@example.com" });

  assert.ok(second.id > first.id);
});

test("createUser grows the list by one", () => {
  const before = store.getAllUsers().length;
  store.createUser({ name: "Extra", email: "extra@example.com" });

  assert.strictEqual(store.getAllUsers().length, before + 1);
});

test("getAllUsers returns the live array, not a copy", () => {
  assert.strictEqual(store.getAllUsers(), store.getAllUsers());
});
