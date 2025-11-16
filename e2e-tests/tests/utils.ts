import request from "supertest";
import { config } from "./config";
import { UserType, AccountType } from "./type";


export const testState = {
    authToken: "",
    userId: "",
    currentTestUser: null as UserType | null, // Initialize as null
    accounts: [] as AccountType[],
};
let testUserInitialized = false;
export const getTestUser = (keepPrevious: boolean = true): UserType => {
    // If we already have a test user, return it
    if (keepPrevious && testState.currentTestUser) {
        return testState.currentTestUser;
    }

    // Otherwise create a new one
    const newUser = {
        firstName: "Test",
        lastName: "User",
        email: `testuser_${Date.now()}@example.com`,
        password: "Test@1234",
    };

    testState.currentTestUser = newUser;
    return newUser;
};

// Add a function to explicitly set the test user
export const setTestUser = (user: UserType) => {
    testState.currentTestUser = user;
};

export const apiGateway = () => request(config.apiGatewayUrl);
export const authService = () => request(config.authServiceUrl);
export const accountService = () => request(config.accountServiceUrl);


export const registerUser = async (user: UserType) => {
    const response = await apiGateway()
        .post("/api/v1/auth/register")
        .send(user)
        .set("Accept", "application/json");
    return response;
};

// In utils.ts - Fix the loginUser function
export const loginUser = async (email: string, password: string) => {
    const response = await apiGateway()
        .post("/api/v1/auth/login")
        .send({ email, password })
        .set("Accept", "application/json");

    if (response.status === 200 && response.body.token) {
        testState.authToken = response.body.token;
        console.log(`Token set successfully: ${testState.authToken.substring(0, 20)}...`);
    }
    return response;
};

export const cleanUpTestState = () => {
    testState.authToken = "";
    testState.userId = "";
    testState.currentTestUser = getTestUser(false); // Reset to a new test user
    testState.accounts = [];
};


export function authenticatedRequest() {
    return apiGateway().set("Authorization", `Bearer ${testState.authToken}`);
}

export async function cleanupResources() {
    for (const account of testState.accounts) {
        try {
            await apiGateway()
                .delete(`/api/v1/accounts/${account.accountNumber}`)
                .set("Authorization", `Bearer ${testState.authToken}`);
        } catch (error) {
            console.error(
                `Failed to delete account ${account.accountNumber}:`,
                error
            );
        }
    }
}