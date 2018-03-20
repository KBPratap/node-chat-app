const expect = require("expect");

const { Users } = require("./users");

describe("Users", () => {
  let users = new Users();

  beforeEach(() => {
    users.users = [
      {
        id: 1,
        name: "Allu",
        room: "Node Course"
      },
      {
        id: 2,
        name: "Ziya",
        room: "React Course"
      },
      {
        id: 3,
        name: "Bhanu",
        room: "Node Course"
      }
    ];
  });

  it("should add new user", () => {
    var users = new Users();
    var user = {
      id: "123",
      name: "Bhanu",
      room: "Node Course"
    };
    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it("should return names for Node Course", () => {
    let userList = users.getUserList("Node Course");
    expect(userList).toEqual(["Allu", "Bhanu"]);
  });

  it("should return names for React Course", () => {
    let userList = users.getUserList("React Course");
    expect(userList).toEqual(["Ziya"]);
  });

  it("should find the user", () => {
    let user = users.getUser(3);
    expect(user.name).toBe("Bhanu");
  });

  it("should not find a user", () => {
    let user = users.getUser(5);
    expect(user).not.toBeDefined;
  });

  it("should remove user", () => {
    let userId = 3;

    let user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it("should not remove user", () => {
    let userId = 99;

    let user = users.removeUser(userId);

    expect(user).not.toBeDefined();
    expect(users.users.length).toBe(3);
  });
});
