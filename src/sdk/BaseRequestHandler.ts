import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Request, Response } from "ask-sdk-model";
import { extendHandlerInput, IExtendedHandlerInput } from "./ExtendedHandlerInput";

/**
 * RequestHandler with canHandle implemented by decorators.
 */
export abstract class BaseRequestHandler implements RequestHandler {
  private readonly types: Array<Request["type"]>;
  private readonly intents: string[];
  private readonly isFallback: boolean;

  public canHandle(handlerInput: HandlerInput): boolean {
    if (this.canHandleByDecorators(handlerInput)) {
      extendHandlerInput(handlerInput);
      return true;
    }

    return false;
  }

  public abstract handle(handlerInput: IExtendedHandlerInput): Promise<Response> | Response;

  private canHandleByDecorators(handlerInput: HandlerInput): boolean {
    if (this.isFallback) {
      return true;
    }

    const request = handlerInput.requestEnvelope.request;
    if (this.intents && request.type === "IntentRequest") {
      return this.intents.indexOf(request.intent.name) !== -1;
    }

    return this.types && this.types.indexOf(request.type) !== -1;
  }
}
