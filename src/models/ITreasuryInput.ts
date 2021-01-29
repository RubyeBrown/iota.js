// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { ITypeBase } from "./ITypeBase";

/**
 * The global type for the treasury input.
 */
export const TREASURY_INPUT_TYPE = 1;

/**
 * Treasury Input.
 */
export interface ITreasuryInput extends ITypeBase<1> {
    /**
     * The milestone hash of the input.
     */
    milestoneHash: string;
}
