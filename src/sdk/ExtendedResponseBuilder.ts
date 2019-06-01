import { HandlerInput, ResponseBuilder } from "ask-sdk-core";
import { Directive, interfaces, RequestEnvelope, SupportedInterfaces, ui } from "ask-sdk-model";
import { IExtendedHandlerInput } from "./ExtendedHandlerInput";

export interface IExtendedResponseBuilder extends ResponseBuilder {
  /**
   * Conditionally executes methods on the builder.
   * @param condition Condition to check. If true, the callback will be executed on the builder.
   * @param callback Code to run on the builder.
   */
  if(condition: ((request: RequestEnvelope) => boolean) | boolean,
     callback: (builder: ResponseBuilder) => void): IExtendedResponseBuilder;

  /**
   * Adds the speech output, if it is allowed, i.e. the current request is not of type "PlaybackController".
   */
  speakIfSupported(speechOutput: string, playBehavior?: ui.PlayBehavior): IExtendedResponseBuilder;

  /**
   * Adds the render template, if the Display interface is supported by the current request.
   * @param template The render template to add.
   */
  addRenderTemplateDirectiveIfSupported(template: interfaces.display.Template): IExtendedResponseBuilder;

  /**
   * Adds the hint, if the Display interface is supported by the current request.
   * @param template The hint to add.
   */
  addHintDirectiveIfSupported(text: string): IExtendedResponseBuilder;

  /**
   * Adds the directive, if the APL interface is supported by the current request.
   * @param directive The directive to add.
   */
  addAplDirectiveIfSupported(directive: Directive): IExtendedResponseBuilder;
}

function getSupportedInterfaces(handlerInput: HandlerInput): SupportedInterfaces {
  return handlerInput.requestEnvelope.context
    && handlerInput.requestEnvelope.context.System
    && handlerInput.requestEnvelope.context.System.device
    && handlerInput.requestEnvelope.context.System.device.supportedInterfaces
    || {};
}

function supportsDisplay(handlerInput: HandlerInput): boolean {
  return !!getSupportedInterfaces(handlerInput).Display;
}

function supportsApl(handlerInput: HandlerInput): boolean {
  return !!getSupportedInterfaces(handlerInput)["Alexa.Presentation.APL"];
}

function isPlaybackController(handlerInput: HandlerInput): boolean {
  return handlerInput.requestEnvelope.request.type.startsWith("PlaybackController");
}

export function getResponseBuilder(handlerInput: IExtendedHandlerInput): IExtendedResponseBuilder {
  const builder = handlerInput.responseBuilder as IExtendedResponseBuilder;

  builder.if = (condition, callback) => {
    const result = typeof condition === "function"
      ? condition(handlerInput.requestEnvelope)
      : condition;
    if (result) {
      callback(builder);
    }
    return builder;
  };
  builder.speakIfSupported = (speechOutput: string, playBehavior?: ui.PlayBehavior) => {
    return builder.if(!isPlaybackController(handlerInput), (n) => {
      n.speak(speechOutput, playBehavior);
    });
  };
  builder.addRenderTemplateDirectiveIfSupported = (template) => {
    return builder.if(supportsDisplay(handlerInput), (n) => {
      n.addRenderTemplateDirective(template);
    });
  };
  builder.addHintDirectiveIfSupported = (text) => {
    return builder.if(supportsDisplay(handlerInput), (n) => {
      n.addHintDirective(text);
    });
  };
  builder.addAplDirectiveIfSupported = (directive: Directive) => {
    return builder.if(supportsApl(handlerInput), (n) => {
      n.addDirective(directive);
    });
  };

  return builder;
}
