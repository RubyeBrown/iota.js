import { IMigratedFunds } from "./IMigratedFunds";
import { ITreasuryTransactionPayload } from "./ITreasuryTransactionPayload";
import { ITypeBase } from "./ITypeBase";
/**
 * The global type for the payload.
 */
export declare const RECEIPT_PAYLOAD_TYPE = 3;
/**
 * Receipt payload.
 */
export interface IReceiptPayload extends ITypeBase<3> {
    /**
     * The milestone index at which the funds were migrated in the legacy network.
     */
    migratedAt: number;
    /**
     * Whether this Receipt is the final one for a given migrated at index.
     */
    final: boolean;
    /**
     * The index data.
     */
    funds: IMigratedFunds[];
    /**
     * The TreasuryTransaction used to fund the funds.
     */
    transaction: ITreasuryTransactionPayload;
}
