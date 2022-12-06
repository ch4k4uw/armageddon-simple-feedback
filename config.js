"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extension_1 = require("ts-auto-mock/extension");
extension_1.Provider.instance.provideMethodWithDeferredValue((_name, value) => {
    return jest.fn().mockImplementation(value);
});
