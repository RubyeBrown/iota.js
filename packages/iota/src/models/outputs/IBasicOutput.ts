// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import type { ITypeBase } from "../ITypeBase";
import type { ICommonOutput } from "./ICommonOutput";

/**
 * The global type for the basic output.
 */
export const BASIC_OUTPUT_TYPE = 3;

/**
 * Basic output.
 */
export interface IBasicOutput extends ITypeBase<3>, ICommonOutput {
    /**
     * The amount of IOTA coins to held by the output.
     */
    amount: number;
}
