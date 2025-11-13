import request from "supertest";
import { config } from "./config";
import { UserType, AccountType } from "./type";


export const getTestUser = (): UserType => ({
    firstName: "Test",
    lastName: "User",
    email: `testuser_${Date.now()}@example.com`,
    password: "Test@1234",
});

export const testState = {
    authToken: "",
    userId: "",
    currentTestUser: getTestUser(),
    accounts: [] as AccountType[],
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

export const loginUser = async (email: string, password: string) => {
    const response = await apiGateway()
        .post("/api/v1/auth/login")
        .send({ email, password })
        .set("Accept", "application/json");
    if (response.body.token && response.status === 200) {
        testState.authToken = response.body.token;
    }
    return response;
};

export const cleanUpTestState = () => {
    testState.authToken = "";
    testState.userId = "";
    testState.currentTestUser = getTestUser();
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