# Alexa SDK Extensions

[![Travis (.org)](https://img.shields.io/travis/corux/ask-extensions.svg)](https://travis-ci.org/corux/ask-extensions)
[![npm](https://img.shields.io/npm/v/@corux/ask-extensions.svg)](https://www.npmjs.com/package/@corux/ask-extensions)
![npm type definitions](https://img.shields.io/npm/types/@corux/ask-extensions.svg)

This package provides various extensions to improve development with Alexa Skills Kit SDK v2.

## Install

```sh
npm install @corux/ask-extensions
```

## Quick Start

The Alexa Extensions consist of two parts: generic code blocks for re-use in different skills and extensions to the ask-sdk framework.

## ask-sdk extensions

### Decorator Framework

The intention of the decorator framework is to provide an easily recognizable syntax to define request handlers.
Decorators replace the `canHandle()` function of traditional request handlers.
To use the decorators, the handler must inherit from `BaseRequestHandler`.

```typescript
import {
  BaseRequestHandler, IExtendedHandlerInput,
  Fallback, Intents, Request,
} from "@corux/ask-extensions";

@Intents("AMAZON.StopIntent", "AMAZON.CancelIntent")
class StopIntentHandler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    ...
  }
}

@Request("LaunchRequest")
class LaunchHandler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    ...
  }
}

@Fallback()
class FallbackHandler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    ...
  }
}
```

### Response Builder

Use the extended response builder to conditionally build up a skill response.

```typescript
class Handler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    return handlerInput.getResponseBuilder()
      .speakIfSupported(...)
      .addRenderTemplateDirectiveIfSupported(...)
      .addHintDirectiveIfSupported(...)
      .addAplDirectiveIfSupported(...)
      .if(checkCondition, (builder) => { ... })
      .getResponse();
  }
}
```

## Reusable code blocks

### Handlers

See a list of available handlers [here](src/handlers).

### Interceptors

See a list of available interceptors [here](src/interceptors).

#### `LocalizationInterceptor`

The localization interceptor configures [i18next](https://www.i18next.com/) for usage in the application.
Localization files will be loaded from the filesystem.

```typescript
SkillBuilders.custom()
  .addRequestInterceptors(
    new LocalizationInterceptor("./i18n/{{lng}}.json"),
  )
```

The i18next `t` function is added to both the `IExtendedHandlerInput` and the request attributes.

```typescript
class Handler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    handlerInput.attributesManager.getRequestAttributes().t("key");
    handlerInput.t("key");
  }
}
```

#### `LogInterceptor`

```typescript
SkillBuilders.custom()
  .addRequestInterceptors(
    new LogInterceptor(),
  )
  .addResponseInterceptors(
    new LogInterceptor(),
  )
```

#### `TimezoneInterceptor`

Retrieves the device's timezone setting.
The interceptor uses [Luxon](https://moment.github.io/luxon/) by default.

To access the settings service, the skill must be configured with an ApiClient.

```typescript
SkillBuilders.custom()
  .addRequestInterceptors(
    new TimezoneInterceptor(),
  )
  .withApiClient(new DefaultApiClient())
```
