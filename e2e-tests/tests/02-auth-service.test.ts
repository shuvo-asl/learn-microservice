import { apiGateway, getTestUser, testState, registerUser, loginUser } from "./utils";

describe("Authentication Service Tests", () => {
    test("User Registration - should return 201 Created", async () => {

        testState.currentTestUser = getTestUser();
        const response = await registerUser(testState.currentTestUser);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("email", testState.currentTestUser.email);
        expect(response.body).toHaveProperty("firstName", testState.currentTestUser.firstName);
        expect(response.body).toHaveProperty("lastName", testState.currentTestUser.lastName);
        testState.userId = response.body.id;
    });

    test("Registration with existing email should return 400 Bad Request", async () => {
        const response = await registerUser(testState.currentTestUser);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("status");
        expect(response.body.status).toBe("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("email already in use");
    });

    test("User Login - should return 200 OK with auth token", async () => {
        const response = await loginUser(testState.currentTestUser.email, testState.currentTestUser.password);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });

    test("Login with incorrect password should return 401 Unauthorized", async () => {
        const response = await loginUser(testState.currentTestUser.email, "WrongPassword123");
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("status");
        expect(response.body.status).toBe("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("invalid email or password");
    });

    test("Logout - should return 200 OK", async () => {
        const response = await apiGateway()
            .post("/api/v1/auth/logout")
            .set("Authorization", `Bearer ${testState.authToken}`)
            .set("Accept", "application/json");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("logged out successfully");
    });
});