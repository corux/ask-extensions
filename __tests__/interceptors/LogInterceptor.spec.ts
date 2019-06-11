import { LogInterceptor } from "../../src";
import { createHandlerInput } from "../utils";

describe("Interceptors", () => {
  describe(LogInterceptor.name, () => {
    it("should log request", () => {
      const consoleMock = console.log = jest.fn();
      const handlerInput = createHandlerInput("LaunchRequest");
      const interceptor = new LogInterceptor();

      interceptor.process(handlerInput, undefined);

      expect(consoleMock).toBeCalledTimes(1);
      expect(consoleMock).toBeCalledWith(`Request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    });

    it("should log response", () => {
      const consoleMock = console.log = jest.fn();
      const handlerInput = createHandlerInput("LaunchRequest");
      const interceptor = new LogInterceptor();

      interceptor.process(handlerInput, {});

      expect(consoleMock).toBeCalledTimes(1);
      expect(consoleMock).toBeCalledWith("Response: {}");
    });
  });
});
