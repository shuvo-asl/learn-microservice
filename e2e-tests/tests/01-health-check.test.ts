import { apiGateway, authService, accountService } from "./utils";

describe("Health Check Endpoints", () => {
    test("API Gateway Health Check should return 200 OK", async () => {
        const response = await apiGateway().get("/health");
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("OK");
    });
    test("Auth Service Health Check should return 200 OK", async () => {
        const response = await authService().get("/health");
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("OK");
    });
    test("Account Service Health Check should return 200 OK", async () => {
        const response = await accountService().get("/health");
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("OK");
    });
});