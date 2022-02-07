// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import type { IPowProvider } from "../models/IPowProvider";

/**
 * Options used when constructing SingleNodeClient.
 */
export interface SingleNodeClientOptions {
    /**
     * Base path for API location, defaults to /api/v2/.
     */
    basePath?: string;

    /**
     * Base path for API plugin location, defaults to /api/plugins/.
     */
    basePluginPath?: string;

    /**
     * Use a custom pow provider instead of the one on the node.
     */
    powProvider?: IPowProvider;

    /**
     * The protocol version for messages.
     */
    protocolVersion?: number;

    /**
     * Timeout for API requests.
     */
    timeout?: number;

    /**
     * Username for the endpoint.
     */
    userName?: string;

    /**
     * Password for the endpoint.
     */
    password?: string;

    /**
     * Additional headers to include in the requests.
     */
    headers?: { [id: string]: string };
}
