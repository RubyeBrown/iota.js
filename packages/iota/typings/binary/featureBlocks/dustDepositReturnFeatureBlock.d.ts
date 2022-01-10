import type { ReadStream, WriteStream } from "@iota/util.js";
import { IDustDepositReturnFeatureBlock } from "../../models/featureBlocks/IDustDepositReturnFeatureBlock";
/**
 * The minimum length of a return feature block binary representation.
 */
export declare const MIN_DUST_DEPOSIT_RETURN_FEATURE_BLOCK_LENGTH: number;
/**
 * Deserialize the dust deposit return feature block from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export declare function deserializeDustDepositReturnFeatureBlock(readStream: ReadStream): IDustDepositReturnFeatureBlock;
/**
 * Serialize the dust deposit return feature block to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export declare function serializeDustDepositReturnFeatureBlock(writeStream: WriteStream, object: IDustDepositReturnFeatureBlock): void;