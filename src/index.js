// TypeScript entry point demonstrating type safety and modern features
var UserService = /** @class */ (function () {
    function UserService() {
        this.users = [];
    }
    UserService.prototype.addUser = function (user) {
        this.users.push(user);
        console.log("User ".concat(user.name, " added successfully"));
    };
    UserService.prototype.getUserById = function (id) {
        return this.users.find(function (user) { return user.id === id; });
    };
    UserService.prototype.getActiveUsers = function () {
        return this.users.filter(function (user) { return user.isActive; });
    };
    UserService.prototype.getTotalUsers = function () {
        return this.users.length;
    };
    return UserService;
}());
// Demonstrate TypeScript features
function main() {
    console.log('🚀 TypeScript project initialized successfully!');
    var userService = new UserService();
    // Type-safe user creation
    var newUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        isActive: true
    };
    userService.addUser(newUser);
    // Type checking in action
    var foundUser = userService.getUserById(1);
    if (foundUser) {
        console.log("Found user: ".concat(foundUser.name, " (").concat(foundUser.email, ")"));
    }
    console.log("Total users: ".concat(userService.getTotalUsers()));
    console.log("Active users: ".concat(userService.getActiveUsers().length));
}
// Run the application
main();
