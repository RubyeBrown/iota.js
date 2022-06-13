// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Converter, ReadStream, WriteStream } from "@iota/util.js";
import {
    deserializeUnlock,
    deserializeUnlocks,
    serializeUnlock,
    serializeUnlocks
} from "../../../src/binary/unlocks/unlocks";
import { ED25519_SIGNATURE_TYPE } from "../../../src/models/signatures/IEd25519Signature";
import {
    IReferenceUnlock,
    REFERENCE_UNLOCK_TYPE
} from "../../../src/models/unlocks/IReferenceUnlock";
import {
    ISignatureUnlock,
    SIGNATURE_UNLOCK_TYPE
} from "../../../src/models/unlocks/ISignatureUnlock";
import type { UnlockTypes } from "../../../src/models/unlocks/unlockTypes";

describe("Binary Unlock", () => {
    test("Can serialize and deserialize unlock", () => {
        const unlockBlocks: UnlockTypes[] = [
            {
                type: SIGNATURE_UNLOCK_TYPE,
                signature: {
                    type: ED25519_SIGNATURE_TYPE,
                    publicKey: "0x6920b176f613ec7be59e68fc68f597eb3393af80f74c7c3db78198147d5f1f92",
                    signature:
                        "0x2c59d43952bda7ca60d3c2288ebc00703b4b60c928d277382cad5f57b02a90825f2d3a8509d6594498e0488f086d8fa3f13d9636d20e759eb5806ffe663bac0d"
                }
            },
            {
                type: REFERENCE_UNLOCK_TYPE,
                reference: 23456
            }
        ];

        const serialized = new WriteStream();
        serializeUnlocks(serialized, unlockBlocks);
        const hex = serialized.finalHex();
        expect(hex).toEqual(
            "020000006920b176f613ec7be59e68fc68f597eb3393af80f74c7c3db78198147d5f1f922c59d43952bda7ca60d3c2288ebc00703b4b60c928d277382cad5f57b02a90825f2d3a8509d6594498e0488f086d8fa3f13d9636d20e759eb5806ffe663bac0d01a05b"
        );
        const deserialized = deserializeUnlocks(new ReadStream(Converter.hexToBytes(hex)));
        expect(deserialized.length).toEqual(2);
        const obj1 = deserialized[0] as ISignatureUnlock;
        expect(obj1.type).toEqual(0);
        expect(obj1.signature.type).toEqual(0);
        expect(obj1.signature.publicKey).toEqual("0x6920b176f613ec7be59e68fc68f597eb3393af80f74c7c3db78198147d5f1f92");
        expect(obj1.signature.signature).toEqual(
            "0x2c59d43952bda7ca60d3c2288ebc00703b4b60c928d277382cad5f57b02a90825f2d3a8509d6594498e0488f086d8fa3f13d9636d20e759eb5806ffe663bac0d"
        );
        const obj2 = deserialized[1] as IReferenceUnlock;
        expect(obj2.type).toEqual(1);
        expect(obj2.reference).toEqual(23456);
    });

    test("Can serialize and deserialize unlock", () => {
        const object: IReferenceUnlock = {
            type: REFERENCE_UNLOCK_TYPE,
            reference: 23456
        };

        const serialized = new WriteStream();
        serializeUnlock(serialized, object);
        const hex = serialized.finalHex();
        expect(hex).toEqual("01a05b");
        const deserialized = deserializeUnlock(new ReadStream(Converter.hexToBytes(hex)));
        const obj1 = deserialized as IReferenceUnlock;
        expect(obj1.type).toEqual(1);
        expect(obj1.reference).toEqual(23456);
    });
});