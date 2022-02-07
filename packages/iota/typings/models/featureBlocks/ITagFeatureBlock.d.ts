import type { ITypeBase } from "../ITypeBase";
/**
 * The global type for the tag feature block.
 */
export declare const TAG_FEATURE_BLOCK_TYPE = 3;
/**
 * Tag feature block.
 */
export interface ITagFeatureBlock extends ITypeBase<3> {
    /**
     * Defines a tag for the data.
     */
    tag: string;
}