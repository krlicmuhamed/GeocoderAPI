"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var geocoding_test_1 = __importDefault(require("./endpoint/geocoding.test"));
var revergeocoding_test_1 = __importDefault(require("./endpoint/revergeocoding.test"));
describe('Geocoding API Tests', function () {
    describe('geocoding endpoint', geocoding_test_1.default.bind(this));
    describe('reverse geocoding endpoint', revergeocoding_test_1.default.bind(this));
});
