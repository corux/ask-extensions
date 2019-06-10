import { HandlerInput, RequestInterceptor } from "ask-sdk-core";
import i18next, * as i18n from "i18next";
import * as Backend from "i18next-sync-fs-backend";
import { IExtendedHandlerInput } from "../sdk";

/**
 * Configures i18next and add the translation function to the handler input and request attributes.
 */
export class LocalizationInterceptor implements RequestInterceptor {
  public constructor(private readonly loadPath: string = "i18n/{{lng}}.json") {}

  public process(handlerInput: HandlerInput) {
    (i18n as any as i18next.i18n)
      .use(Backend)
      .init({
        backend: {
          loadPath: this.loadPath,
        },
        defaultNS: "translation",
        initImmediate: false,
        lng: handlerInput.requestEnvelope.request.locale,
        returnObjects: true,
      }, (err, t) => {
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        const tFunction = this.randomTranslation(t);

        attributes.t = tFunction;
        (handlerInput as IExtendedHandlerInput).t = tFunction;
      });
  }

  private randomTranslation(t: i18next.TFunction): i18next.TFunction {
    return (key, options) => {
      const result = t(key, options);

      if (Array.isArray(result)) {
        return result[Math.floor(Math.random() * result.length)];
      } else {
        return result;
      }
    };
  }
}
