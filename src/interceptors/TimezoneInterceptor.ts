import { HandlerInput, RequestInterceptor } from "ask-sdk-core";
import { Settings } from "luxon";

function luxonHandler(timezone: string): void {
  Settings.defaultZoneName = timezone;
}

/**
 * Retrieves the devices timezone setting.
 * By default it configures Luxon to use the timezone instead of UTC.
 *
 * This interceptor requires a configured ApiClient, e.g.:
 *
 * <code>
 * SkillBuilders.custom()
 *   ...
 *   .withApiClient(new DefaultApiClient())
 *   ...
 * </code>
 */
export class TimezoneInterceptor implements RequestInterceptor {

  private cache: { [deviceId: string]: string } = {};

  public constructor(private readonly callback: (timezone: string) => void = luxonHandler) { }

  public async process(handlerInput: HandlerInput) {
    const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;

    if (!deviceId) {
      return;
    }

    try {
      if (!this.cache[deviceId]) {
        const upsServiceClient = handlerInput.serviceClientFactory.getUpsServiceClient();
        this.cache[deviceId] = await upsServiceClient.getSystemTimeZone(deviceId);
      }

      const timezone = this.cache[deviceId];

      this.callback(timezone);

      console.log("Configured timezone for request:", {
        deviceId,
        timezone,
      });
    } catch (e) {
      console.log("Unable to determine device timezone.", e);
    }
  }
}
