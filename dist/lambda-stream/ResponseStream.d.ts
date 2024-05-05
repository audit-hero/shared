/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { Stream } from 'stream';
export declare class ResponseStream extends Stream.Writable {
    private response;
    _contentType?: string;
    _isBase64Encoded?: boolean;
    constructor();
    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void;
    getBufferedData(): Buffer;
    setContentType(contentType: string): void;
    setIsBase64Encoded(isBase64Encoded: boolean): void;
}
