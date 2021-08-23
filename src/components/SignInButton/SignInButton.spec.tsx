import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import React from "react";
import { SignInButton } from ".";
import { useSession } from "next-auth/client";

jest.mock("next-auth/client")

const useSessionMocked = mocked(useSession);

describe("SignInButton Component", () => {
  it("should renders correctly when user is not authenticated", () => {
    useSessionMocked.mockReturnValue([null, false]);

    render(<SignInButton />);
    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });

  it("should renders correctly when user is authenticated", () => {
    useSessionMocked.mockReturnValue([
      {
        user: { name: "John Doe", email: "john.doe@gmail.com" },
        expires: "fake-expires",
      },
      false,
    ]);

    render(<SignInButton />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
