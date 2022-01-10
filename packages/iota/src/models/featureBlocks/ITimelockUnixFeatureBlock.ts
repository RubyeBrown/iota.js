// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import type { ITypeBase } from "../ITypeBase";

/**
 * The global type for the timelock unix feature block.
 */
export const TIMELOCK_UNIX_FEATURE_BLOCK_TYPE = 4;

/**
 * Timelock Unix feature block.
 */
export interface ITimelockUnixFeatureBlock extends ITypeBase<4> {
    /**
     * Unix time (seconds since Unix epoch) starting from which the output can be consumed.
     */
    unixTime: number;
}