import { describe, expect, test } from "vitest";
import { LoginDTO } from "../../dto/loginDTO.js";
import {  RegisterDTO } from "../../dto/registerDTO.js";


function assertLoginDTO(dto: LoginDTO) {
  return dto;
}

function assertRegisterDTO(dto: RegisterDTO) {
  return dto;
}

describe("DTO Interfaces", () => {
  test("LoginDTO should accept a valid object", () => {
    const validLogin = {
      email: "test@example.com",
      password: "secret",
    };

    const result = assertLoginDTO(validLogin);
    expect(result).toEqual(validLogin);
  });

  test("RegisterDTO should accept a valid object", () => {
    const validRegister = {
      email: "test@example.com",
      username: "testuser",
      password: "secret",
    };

    const result = assertRegisterDTO(validRegister);
    expect(result).toEqual(validRegister);
  });
});
