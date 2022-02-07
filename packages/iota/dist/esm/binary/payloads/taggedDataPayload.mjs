import { TAGGED_DATA_PAYLOAD_TYPE } from "../../models/payloads/ITaggedDataPayload.mjs";
import { UINT8_SIZE, TYPE_LENGTH, UINT32_SIZE } from "../commonDataTypes.mjs";
/**
 * The minimum length of a tagged data payload binary representation.
 */
export const MIN_TAGGED_DATA_PAYLOAD_LENGTH = TYPE_LENGTH + // min payload
    UINT8_SIZE + // tag length
    UINT32_SIZE; // data length
/**
 * The minimum length of a tag.
 */
export const MIN_TAG_LENGTH = 1;
/**
 * The maximum length of a tag.
 */
export const MAX_TAG_LENGTH = 64;
/**
 * Deserialize the tagged data payload from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeTaggedDataPayload(readStream) {
    if (!readStream.hasRemaining(MIN_TAGGED_DATA_PAYLOAD_LENGTH)) {
        throw new Error(`Tagged Data Payload data is ${readStream.length()} in length which is less than the minimimum size required of ${MIN_TAGGED_DATA_PAYLOAD_LENGTH}`);
    }
    const type = readStream.readUInt32("payloadTaggedData.type");
    if (type !== TAGGED_DATA_PAYLOAD_TYPE) {
        throw new Error(`Type mismatch in payloadTaggedData ${type}`);
    }
    const tagLength = readStream.readUInt8("payloadTaggedData.tagLength");
    const tag = readStream.readFixedHex("payloadTaggedData.tag", tagLength);
    let data;
    const dataLength = readStream.readUInt32("payloadTaggedData.dataLength");
    if (dataLength > 0) {
        data = readStream.readFixedHex("payloadTaggedData.data", dataLength);
    }
    return {
        type: TAGGED_DATA_PAYLOAD_TYPE,
        tag,
        data
    };
}
/**
 * Serialize the tagged data payload to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeTaggedDataPayload(writeStream, object) {
    if (object.tag.length < MIN_TAG_LENGTH) {
        throw new Error(`The tag length is ${object.tag.length / 2}, which is less than the minimum size of ${MIN_TAG_LENGTH}`);
    }
    if (object.tag && object.tag.length / 2 > MAX_TAG_LENGTH) {
        throw new Error(`The tag length is ${object.tag.length / 2}, which exceeds the maximum size of ${MAX_TAG_LENGTH}`);
    }
    writeStream.writeUInt32("payloadTaggedData.type", object.type);
    writeStream.writeUInt8("payloadTaggedData.tagLength", object.tag.length / 2);
    writeStream.writeFixedHex("payloadTaggedData.tag", object.tag.length / 2, object.tag);
    if (object.data) {
        writeStream.writeUInt32("payloadTaggedData.dataLength", object.data.length / 2);
        writeStream.writeFixedHex("payloadTaggedData.data", object.data.length / 2, object.data);
    }
    else {
        writeStream.writeUInt32("payloadTaggedData.dataLength", 0);
    }
}