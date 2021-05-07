"use strict";
// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
// Implementation derived from chacha-ref.c version 20080118
// See for details: http://cr.yp.to/chacha/chacha-20080128.pdf
// https://www.ietf.org/rfc/rfc8439.html
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChaCha20 = void 0;
var bitHelper_1 = require("../utils/bitHelper");
var ChaCha20 = /** @class */ (function () {
    /**
     * Create a new instance of ChaCha20.
     * @param key The key.
     * @param nonce The nonce.
     * @param counter Counter.
     */
    function ChaCha20(key, nonce, counter) {
        if (counter === void 0) { counter = 0; }
        this._input = new Uint32Array(16);
        // https://www.ietf.org/rfc/rfc8439.html#section-2.3
        this._input[0] = 1634760805;
        this._input[1] = 857760878;
        this._input[2] = 2036477234;
        this._input[3] = 1797285236;
        this._input[4] = bitHelper_1.BitHelper.u8To32LittleEndian(key, 0);
        this._input[5] = bitHelper_1.BitHelper.u8To32LittleEndian(key, 4);
        this._input[6] = bitHelper_1.BitHelper.u8To32LittleEndian(key, 8);
        this._input[7] = bitHelper_1.BitHelper.u8To32LittleEndian(key, 12);
        this._input[8] = bitHelper_1.BitHelper.u8To32LittleEndian(key, 16);
        this._input[9] = bitHelper_1.BitHelper.u8To32LittleEndian(key, 20);
        this._input[10] = bitHelper_1.BitHelper.u8To32LittleEndian(key, 24);
        this._input[11] = bitHelper_1.BitHelper.u8To32LittleEndian(key, 28);
        this._input[12] = counter;
        this._input[13] = bitHelper_1.BitHelper.u8To32LittleEndian(nonce, 0);
        this._input[14] = bitHelper_1.BitHelper.u8To32LittleEndian(nonce, 4);
        this._input[15] = bitHelper_1.BitHelper.u8To32LittleEndian(nonce, 8);
    }
    /**
     * Quarter round.
     * @param x The 32 bit array.
     * @param a The a index.
     * @param b The b index.
     * @param c The c index.
     * @param d The d index.
     * @internal
     */
    ChaCha20.quarterRound = function (x, a, b, c, d) {
        x[a] += x[b];
        x[d] = bitHelper_1.BitHelper.rotate(x[d] ^ x[a], 16);
        x[c] += x[d];
        x[b] = bitHelper_1.BitHelper.rotate(x[b] ^ x[c], 12);
        x[a] += x[b];
        x[d] = bitHelper_1.BitHelper.rotate(x[d] ^ x[a], 8);
        x[c] += x[d];
        x[b] = bitHelper_1.BitHelper.rotate(x[b] ^ x[c], 7);
    };
    /**
     * Encrypt the data.
     * @param data The source data to encrypt.
     * @returns The encrypted data.
     */
    ChaCha20.prototype.encrypt = function (data) {
        var x = new Uint32Array(16);
        var output = new Uint8Array(64);
        var dpos = 0;
        var i;
        var spos = 0;
        var len = data.length;
        var dst = new Uint8Array(data.length);
        while (len > 0) {
            for (i = 16; i--;) {
                x[i] = this._input[i];
            }
            for (i = 20; i > 0; i -= 2) {
                ChaCha20.quarterRound(x, 0, 4, 8, 12);
                ChaCha20.quarterRound(x, 1, 5, 9, 13);
                ChaCha20.quarterRound(x, 2, 6, 10, 14);
                ChaCha20.quarterRound(x, 3, 7, 11, 15);
                ChaCha20.quarterRound(x, 0, 5, 10, 15);
                ChaCha20.quarterRound(x, 1, 6, 11, 12);
                ChaCha20.quarterRound(x, 2, 7, 8, 13);
                ChaCha20.quarterRound(x, 3, 4, 9, 14);
            }
            for (i = 16; i--;) {
                x[i] += this._input[i];
            }
            for (i = 16; i--;) {
                bitHelper_1.BitHelper.u32To8LittleEndian(output, 4 * i, x[i]);
            }
            this._input[12] += 1;
            if (!this._input[12]) {
                this._input[13] += 1;
            }
            if (len <= 64) {
                for (i = len; i--;) {
                    dst[i + dpos] = data[i + spos] ^ output[i];
                }
                return dst;
            }
            for (i = 64; i--;) {
                dst[i + dpos] = data[i + spos] ^ output[i];
            }
            len -= 64;
            spos += 64;
            dpos += 64;
        }
        return dst;
    };
    /**
     * Decrypt the data.
     * @param data The source data to decrypt.
     * @returns The decrypted data.
     */
    ChaCha20.prototype.decrypt = function (data) {
        return this.encrypt(data);
    };
    /**
     * Create a keystream of the given length.
     * @param length The length to create the keystream.
     * @returns The keystream.
     */
    ChaCha20.prototype.keyStream = function (length) {
        var dst = new Uint8Array(length);
        for (var i = 0; i < dst.length; i++) {
            dst[i] = 0;
        }
        return this.encrypt(dst);
    };
    return ChaCha20;
}());
exports.ChaCha20 = ChaCha20;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhQ2hhMjAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY3J5cHRvL2NoYUNoYTIwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrQkFBK0I7QUFDL0Isc0NBQXNDO0FBQ3RDLCtCQUErQjtBQUMvQiw0REFBNEQ7QUFDNUQsOERBQThEO0FBQzlELHdDQUF3Qzs7O0FBRXhDLGdEQUErQztBQUUvQztJQU9JOzs7OztPQUtHO0lBQ0gsa0JBQVksR0FBZSxFQUFFLEtBQWlCLEVBQUUsT0FBbUI7UUFBbkIsd0JBQUEsRUFBQSxXQUFtQjtRQUMvRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRWxDLG9EQUFvRDtRQUNwRCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLHFCQUFTLENBQUMsa0JBQWtCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcscUJBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxxQkFBUyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLHFCQUFTLENBQUMsa0JBQWtCLENBQUMsR0FBRyxF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TSxDQUFDLENBQUM7UUFFeEMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxFQUFFO1lBQ1osS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHO2dCQUNmLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pCO1lBQ0QsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDeEIsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3RDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUN0QyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDdkMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3ZDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUN2QyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDdkMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3RDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ3pDO1lBQ0QsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHO2dCQUNmLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzFCO1lBQ0QsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHO2dCQUNmLHFCQUFTLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDckQ7WUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDeEI7WUFDRCxJQUFJLEdBQUcsSUFBSSxFQUFFLEVBQUU7Z0JBQ1gsS0FBSyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHO29CQUNoQixHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM5QztnQkFDRCxPQUFPLEdBQUcsQ0FBQzthQUNkO1lBQ0QsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHO2dCQUNmLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDOUM7WUFDRCxHQUFHLElBQUksRUFBRSxDQUFDO1lBQ1YsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNYLElBQUksSUFBSSxFQUFFLENBQUM7U0FDZDtRQUVELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSwwQkFBTyxHQUFkLFVBQWUsSUFBZ0I7UUFDM0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksNEJBQVMsR0FBaEIsVUFBaUIsTUFBYztRQUMzQixJQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNqQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNMLGVBQUM7QUFBRCxDQUFDLEFBcElELElBb0lDO0FBcElZLDRCQUFRIn0=