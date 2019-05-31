import { Request } from "ask-sdk-model";
import { IExtendedHandlerInput } from "../src";

export function createHandlerInput(requestType: Request["type"], intentName: string = null): IExtendedHandlerInput {
  const request = {
    type: requestType,
  } as Request;

  if (request.type === "IntentRequest") {
    request.intent = {
      confirmationStatus: null,
      name: intentName,
    };
  }

  return {
    attributesManager: null,
    requestEnvelope: {
      context: null,
      request,
      version: null,
    },
    responseBuilder: {},
  } as IExtendedHandlerInput;
}
