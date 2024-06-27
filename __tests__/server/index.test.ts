process.argv.push("--run");
import request from "supertest";
import { app } from "../../src/server/index";

jest.mock("../../src/lib/block");
jest.mock("../../src/lib/blockchain");

describe("Blockchain Controller Runner Config Tests", () => {
    test("Should GET blockchain status", async () => {
        const response = await request(app).get("/blockchain/status");
        
        expect(response.status).toEqual(200);
        expect(response.body.isValid.success).toBeTruthy();
        expect(response.body.isValid.message).toBeUndefined();
    });
});