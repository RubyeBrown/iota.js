"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promote = void 0;
// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
var message_1 = require("../binary/message");
/**
 * Promote an existing message.
 * @param client The client to perform the promote with.
 * @param messageId The message to promote.
 * @returns The id and message that were promoted.
 */
function promote(client, messageId) {
    return __awaiter(this, void 0, void 0, function () {
        var message, tipsResponse, promoteMessage, promoteMessageId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.message(messageId)];
                case 1:
                    message = _a.sent();
                    if (!message) {
                        throw new Error("The message does not exist.");
                    }
                    return [4 /*yield*/, client.tips()];
                case 2:
                    tipsResponse = _a.sent();
                    // Parents must be unique and lexicographically sorted
                    // so don't add the messageId if it is already one of the tips
                    if (!tipsResponse.tips.includes(messageId)) {
                        tipsResponse.tips.push(messageId);
                    }
                    // If we now exceed the max parents remove one
                    if (tipsResponse.tips.length > message_1.MAX_NUMBER_PARENTS) {
                        tipsResponse.tips.shift();
                    }
                    // Finally sort the list
                    tipsResponse.tips.sort();
                    promoteMessage = {
                        parents: tipsResponse.tips
                    };
                    return [4 /*yield*/, client.messageSubmit(promoteMessage)];
                case 3:
                    promoteMessageId = _a.sent();
                    return [2 /*return*/, {
                            message: message,
                            messageId: promoteMessageId
                        }];
            }
        });
    });
}
exports.promote = promote;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbW90ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oaWdoTGV2ZWwvcHJvbW90ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBK0I7QUFDL0Isc0NBQXNDO0FBQ3RDLDZDQUF1RDtBQUl2RDs7Ozs7R0FLRztBQUNILFNBQXNCLE9BQU8sQ0FBQyxNQUFlLEVBQUUsU0FBaUI7Ozs7O3dCQUk1QyxxQkFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFBOztvQkFBekMsT0FBTyxHQUFHLFNBQStCO29CQUMvQyxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztxQkFDbEQ7b0JBRW9CLHFCQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBQTs7b0JBQWxDLFlBQVksR0FBRyxTQUFtQjtvQkFFeEMsc0RBQXNEO29CQUN0RCw4REFBOEQ7b0JBQzlELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTt3QkFDeEMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7cUJBQ3JDO29CQUVELDhDQUE4QztvQkFDOUMsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyw0QkFBa0IsRUFBRTt3QkFDL0MsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDN0I7b0JBRUQsd0JBQXdCO29CQUN4QixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUVuQixjQUFjLEdBQWE7d0JBQzdCLE9BQU8sRUFBRSxZQUFZLENBQUMsSUFBSTtxQkFDN0IsQ0FBQztvQkFFdUIscUJBQU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsRUFBQTs7b0JBQTdELGdCQUFnQixHQUFHLFNBQTBDO29CQUVuRSxzQkFBTzs0QkFDSCxPQUFPLFNBQUE7NEJBQ1AsU0FBUyxFQUFFLGdCQUFnQjt5QkFDOUIsRUFBQzs7OztDQUNMO0FBbkNELDBCQW1DQyJ9