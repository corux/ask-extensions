import { SessionEndedHandler } from "../../src";
import { createHandlerInput } from "../utils";

describe("Handlers", () => {
  describe(SessionEndedHandler.name, () => {
    it("should handle SessionEndedRequest", () => {
      expect(new SessionEndedHandler().canHandle(createHandlerInput("CanFulfillIntentRequest"))).toBeFalsy();
      expect(new SessionEndedHandler().canHandle(createHandlerInput("SessionEndedRequest"))).toBeTruthy();
    });

    it("should return empty object", () => {
      expect(new SessionEndedHandler().handle(createHandlerInput("SessionEndedRequest"))).toEqual({});
    });
  });
});
