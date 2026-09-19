import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { Spinner } from "../components/ui/Spinner";

describe("Frontend Spinner Component", () => {
  it("renders SVG loading spinner with animate-spin class", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("animate-spin");
  });
});
