import { HandlerInput } from "ask-sdk-core";
import i18next from "i18next";
import { getResponseBuilder, IExtendedResponseBuilder } from "./ExtendedResponseBuilder";
import { Locale } from "./Locale";

export interface IExtendedHandlerInput extends HandlerInput {
  t: i18next.TFunction;
  getLocale(): Locale;
  getResponseBuilder(): IExtendedResponseBuilder;
}

export function extendHandlerInput(handlerInput: HandlerInput): void {
  const extended = handlerInput as IExtendedHandlerInput;

  extended.getLocale = () => (handlerInput.requestEnvelope.request as { locale: string }).locale as Locale;
  extended.getResponseBuilder = () => getResponseBuilder(extended);
}
