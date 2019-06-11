import { LocalizationInterceptor } from "../../src";
import { createHandlerInput } from "../utils";

describe("Interceptors", () => {
  describe(LocalizationInterceptor.name, () => {
    it("should configure HandlerInput to include t function", async () => {
      const handlerInput = createHandlerInput("LaunchRequest");
      const interceptor = new LocalizationInterceptor();

      expect(handlerInput.t).toBeFalsy();

      await interceptor.process(handlerInput);

      expect(handlerInput.t).toBeTruthy();
    });

    it("should provide a working t function", async () => {
      const handlerInput = createHandlerInput("LaunchRequest");
      const interceptor = new LocalizationInterceptor();

      await interceptor.process(handlerInput);
      const t = handlerInput.t;

      expect(t("test-key")).toBe("test-key");
    });
  });
});
