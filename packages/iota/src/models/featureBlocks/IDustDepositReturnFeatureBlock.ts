// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import type { ITypeBase } from "../ITypeBase";

/**
 * The global type for the dust deposit return feature block.
 */
export const DUST_DEPOSIT_RETURN_FEATURE_BLOCK_TYPE = 2;

/**
 * Return feature block.
 */
export interface IDustDepositReturnFeatureBlock extends ITypeBase<2> {
    /**
     * Amount of IOTA tokens the consuming transaction should deposit to the address defined in Sender Block.
     */
    amount: number;
}