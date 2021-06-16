// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import type { IReferenceUnlockBlock } from "./IReferenceUnlockBlock";
import type { ISignatureUnlockBlock } from "./ISignatureUnlockBlock";
import type { ITransactionEssence } from "./ITransactionEssence";
import type { ITypeBase } from "./ITypeBase";

/**
 * The global type for the payload.
 */
export const TRANSACTION_PAYLOAD_TYPE = 0;

/**
 * Transaction payload.
 */
export interface ITransactionPayload extends ITypeBase<0> {
    /**
     * The index name.
     */
    essence: ITransactionEssence;

    /**
     * The unlock blocks.
     */
    unlockBlocks: (ISignatureUnlockBlock | IReferenceUnlockBlock)[];
}
