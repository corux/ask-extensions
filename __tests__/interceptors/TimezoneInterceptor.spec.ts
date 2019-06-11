import { Settings } from "luxon";
import { TimezoneInterceptor } from "../../src";
import { createHandlerInput } from "../utils";

describe("Interceptors", () => {
  describe(TimezoneInterceptor.name, () => {
    it("should skip timezone retrieval, if deviceId not provided", async () => {
      const callback = jest.fn();
      const handlerInput = createHandlerInput("LaunchRequest");
      handlerInput.requestEnvelope.context.System.device.deviceId = undefined;
      const interceptor = new TimezoneInterceptor(callback);

      await interceptor.process(handlerInput);

      expect(callback).not.toBeCalled();
    });

    it("should retrieve timezone and call callback", async () => {
      const callback = jest.fn();
      const handlerInput = createHandlerInput("LaunchRequest");
      handlerInput.requestEnvelope.context.System.device.deviceId = "testDevice";
      const getSystemTimezoneMock = jest.fn(() => "Europe/Berlin");
      handlerInput.serviceClientFactory.getUpsServiceClient = () => ({
        getSystemTimeZone: getSystemTimezoneMock,
      }) as any;
      const interceptor = new TimezoneInterceptor(callback);

      await interceptor.process(handlerInput);

      expect(getSystemTimezoneMock).toBeCalledWith("testDevice");
      expect(callback).toBeCalledWith("Europe/Berlin");
    });

    it("should configure luxon by default", async () => {
      const handlerInput = createHandlerInput("LaunchRequest");
      handlerInput.requestEnvelope.context.System.device.deviceId = "testDevice";
      const getSystemTimezoneMock = jest.fn(() => "Europe/Berlin");
      handlerInput.serviceClientFactory.getUpsServiceClient = () => ({
        getSystemTimeZone: getSystemTimezoneMock,
      }) as any;
      const interceptor = new TimezoneInterceptor();

      await interceptor.process(handlerInput);

      expect(Settings.defaultZoneName).toBe("Europe/Berlin");
    });
  });
});
