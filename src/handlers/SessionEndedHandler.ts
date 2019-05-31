import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseRequestHandler, Request } from "../sdk";

@Request("SessionEndedRequest")
export class SessionEndedHandler extends BaseRequestHandler {
  public handle(handlerInput: HandlerInput): Response {
    return handlerInput.responseBuilder
      .getResponse();
  }
}
