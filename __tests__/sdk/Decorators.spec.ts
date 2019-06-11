// tslint:disable:max-classes-per-file
import { Response } from "ask-sdk-model";
import { BaseRequestHandler, Fallback, IExtendedHandlerInput, Intents, Request } from "../../src";
import { createHandlerInput } from "../utils";

describe("Decorator Framework", () => {
  describe(Fallback.name, () => {
    @Fallback()
    class TestHandler extends BaseRequestHandler {
      public handle(handlerInput: IExtendedHandlerInput): Response {
        throw new Error("Method not implemented.");
      }
    }

    it("should handle all requests", () => {
      expect(new TestHandler().canHandle(createHandlerInput("CanFulfillIntentRequest"))).toBeTruthy();
    });
  });

  describe(Request.name, () => {
    @Request("AlexaSkillEvent.SkillEnabled", "AlexaSkillEvent.SkillDisabled")
    class TestHandler extends BaseRequestHandler {
      public handle(handlerInput: IExtendedHandlerInput): Response {
        throw new Error("Method not implemented.");
      }
    }

    it("should handle all decorated requests", () => {
      expect(new TestHandler().canHandle(createHandlerInput("AlexaSkillEvent.SkillEnabled"))).toBeTruthy();
      expect(new TestHandler().canHandle(createHandlerInput("AlexaSkillEvent.SkillDisabled"))).toBeTruthy();
    });

    it("should handle not handle undecorated requests", () => {
      expect(new TestHandler().canHandle(createHandlerInput("LaunchRequest"))).toBeFalsy();
    });
  });

  describe(Intents.name, () => {
    @Intents("TestIntent1", "TestIntent2")
    class TestHandler extends BaseRequestHandler {
      public handle(handlerInput: IExtendedHandlerInput): Response {
        throw new Error("Method not implemented.");
      }
    }

    it("should handle all decorated intents", () => {
      expect(new TestHandler().canHandle(createHandlerInput("IntentRequest", "TestIntent1"))).toBeTruthy();
      expect(new TestHandler().canHandle(createHandlerInput("IntentRequest", "TestIntent2"))).toBeTruthy();
    });

    it("should handle not handle undecorated intents", () => {
      expect(new TestHandler().canHandle(createHandlerInput("IntentRequest", "OtherIntent"))).toBeFalsy();
    });
  });

  describe("Combined Intents and Request", () => {
    @Intents("TestIntent1", "TestIntent2")
    @Request("LaunchRequest")
    class TestHandler extends BaseRequestHandler {
      public handle(handlerInput: IExtendedHandlerInput): Response {
        throw new Error("Method not implemented.");
      }
    }

    it("should handle all decorated intents and requests", () => {
      expect(new TestHandler().canHandle(createHandlerInput("LaunchRequest"))).toBeTruthy();
      expect(new TestHandler().canHandle(createHandlerInput("IntentRequest", "TestIntent1"))).toBeTruthy();
      expect(new TestHandler().canHandle(createHandlerInput("IntentRequest", "TestIntent2"))).toBeTruthy();
    });

    it("should handle not handle undecorated intents and requests", () => {
      expect(new TestHandler().canHandle(createHandlerInput("SessionEndedRequest"))).toBeFalsy();
      expect(new TestHandler().canHandle(createHandlerInput("IntentRequest", "OtherIntent"))).toBeFalsy();
    });
  });
});
