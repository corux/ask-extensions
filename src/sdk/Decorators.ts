import { Request } from "ask-sdk-model";
import { BaseRequestHandler } from "./BaseRequestHandler";

/** Marks this request handler to be used as fallback. */
export function Fallback() {
  return <T extends BaseRequestHandler>(target: new (...args: any[]) => T) => {
    target.prototype.isFallback = true;
  };
}

/** Marks this request handler to support the given intents. */
export function Intents(...intents: string[]) {
  return <T extends BaseRequestHandler>(target: new (...args: any[]) => T) => {
    target.prototype.intents = intents;
  };
}

/** Marks this request handler to support the given request types. */
export function Request(...types: Array<Request["type"]>) {
  return <T extends BaseRequestHandler>(target: new (...args: any[]) => T) => {
    target.prototype.types = types;
  };
}
