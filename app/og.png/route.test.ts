import { describe, expect, it, vi } from "vitest";
import { SocialCard } from "@/components/social-card";
import { socialImageSize } from "@/lib/metadata";

vi.mock("next/og", () => ({
  ImageResponse: class ImageResponse {
    element: unknown;
    options: unknown;

    constructor(element: unknown, options: unknown) {
      this.element = element;
      this.options = options;
    }
  },
}));

import { GET, dynamic } from "./route";

describe("social image route", () => {
  it("is prerendered so crawlers fetch a static file", () => {
    expect(dynamic).toBe("force-static");
  });

  it("renders the shared card at the advertised size", () => {
    const response = GET() as unknown as { element: { type: unknown }; options: unknown };

    expect(response.element.type).toBe(SocialCard);
    expect(response.options).toEqual(socialImageSize);
  });
});
