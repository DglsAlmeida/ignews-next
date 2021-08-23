import { render, screen, fireEvent } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import React from "react";
import { SubscribeButton } from ".";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/client";

jest.mock("next-auth/client");
jest.mock("next/router");

const useSessionMocked = mocked(useSession);

describe("SubscriberButton Component", () => {
  it("should renders correctly", () => {
    useSessionMocked.mockReturnValueOnce([null, false]);
    render(<SubscribeButton />);
    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("should redirects user to signIn when not authenticated", () => {
    useSessionMocked.mockReturnValueOnce([null, false]);

    const signInMocked = mocked(signIn);
    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("should redirects to posts when user already has a subscription", () => {
    const useRouterMocked = mocked(useRouter);
    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: "John Doe", email: "john.doe@gmail.com" },
        activeSubscription: "fake-active-subscription",
        expires: "fake-expires",
      },
      false,
    ]);

    const pushMock = jest.fn();

    useRouterMocked.mockReturnValue({
      push: pushMock,
    } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith("/posts");
  });
});
