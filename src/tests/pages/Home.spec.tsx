import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripe";

jest.mock("next/router");
jest.mock("next-auth/client", () => {
  return {
    useSession: () => [null, false],
  };
});
jest.mock("../../services/stripe");

describe("Home Page", () => {
  it("should renders correctly", () => {
    const product = {
      priceId: "fake-price-id",
      amount: "R$10,00",
    };

    render(<Home product={product} />);
    expect(screen.getByText("for R$10,00 month")).toBeInTheDocument();
  });

  it("Loads initial data", async () => {
    const RetrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    RetrieveStripePricesMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-price-id",
            amount: '$10.00',
          }
        }
      })
    )
  });
});
