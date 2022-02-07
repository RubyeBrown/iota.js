// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Converter, WriteStream } from "@iota/util.js";
import { serializeMessage } from "../../src/binary/message";
import type { IMessage } from "../../src/models/IMessage";
import { ITaggedDataPayload, TAGGED_DATA_PAYLOAD_TYPE } from "../../src/models/payloads/ITaggedDataPayload";
import { LocalPowProvider } from "../../src/pow/localPowProvider";
import { PowHelper } from "../../src/utils/powHelper";

describe("LocalPowProvider", () => {
    test("Calculate from an empty message", async () => {
        const pow = new LocalPowProvider();

        const taggedDataPayload: ITaggedDataPayload = {
            type: TAGGED_DATA_PAYLOAD_TYPE,
            tag: Converter.utf8ToHex("hello world"),
            data: Converter.bytesToHex(Uint8Array.from([1, 2, 3, 4]))
        };

        const message: IMessage = {
            protocolVersion: 1,
            payload: taggedDataPayload
        };

        const writeStream = new WriteStream();
        serializeMessage(writeStream, message);
        const messageBytes = writeStream.finalBytes();

        const nonce = await pow.pow(messageBytes, 100);
        expect(nonce).toEqual("6071");

        const score = PowHelper.score(messageBytes);

        expect(Number.parseInt(nonce, 10)).toBeGreaterThanOrEqual(score);
    });
});
