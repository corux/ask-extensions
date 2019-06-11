import { Directive, interfaces, Response, ui } from "ask-sdk-model";
import { BaseRequestHandler, Fallback, IExtendedHandlerInput } from "../../src";
import { getResponseBuilder } from "../../src/sdk/ExtendedResponseBuilder";
import { createHandlerInput } from "../utils";

describe("Extended ASK models", () => {
  describe("ExtendedHandlerInput", () => {
    @Fallback()
    class TestHandler extends BaseRequestHandler {
      constructor(private readonly callback: (input: IExtendedHandlerInput) => void) {
        super();
      }
      public handle(handlerInput: IExtendedHandlerInput): Response {
        this.callback(handlerInput);
        return null;
      }
    }

    it("should extend HandlerInput with helper methods", () => {
      const mock = jest.fn();
      const handler = new TestHandler(mock);
      const input = createHandlerInput("LaunchRequest");
      input.requestEnvelope.request.locale = "de-DE";

      handler.canHandle(input);
      handler.handle(input);

      expect(input.getLocale).toBeDefined();
      expect(input.getResponseBuilder).toBeDefined();
      expect(mock).toBeCalledWith(input);

      expect(input.getLocale()).toBe("de-DE");
      expect(input.getResponseBuilder()).toBeDefined();
    });
  });

  describe("ExtendedResponseBuilder", () => {
    it("should conditionally add to the builder", () => {
      const builder = getResponseBuilder(createHandlerInput("LaunchRequest"));

      builder.if(false, () => fail());
      builder.if((request) => request.request.type === "SessionEndedRequest", () => fail());

      builder.if(true, (n) => expect(n).toBe(builder));
      builder.if((request) => request.request.type === "LaunchRequest", (n) => expect(n).toBe(builder));
    });

    it("should add speak output if supported", () => {
      const builder = getResponseBuilder(createHandlerInput("LaunchRequest"));
      builder.speak = jest.fn();

      builder.speakIfSupported("test");

      expect(builder.speak).toBeCalledWith("test", undefined);
    });

    it("should add APL directive if supported", () => {
      const input = createHandlerInput("LaunchRequest");
      input.requestEnvelope.context = {
        System: {
          device: {
            deviceId: "",
            supportedInterfaces: {
              "Alexa.Presentation.APL": {
                runtime: {
                  maxVersion: "1.0",
                },
              },
            },
          },
        } as interfaces.system.SystemState,
      };
      const builder = getResponseBuilder(input);

      builder.addDirective = jest.fn();
      const directive: Directive = {
        type: "Alexa.Presentation.APL.RenderDocument",
      };

      builder.addAplDirectiveIfSupported(directive);

      expect(builder.addDirective).toBeCalledWith(directive);
    });
  });
});
