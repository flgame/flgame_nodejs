/// <reference path="../libs/mime/mime.d.ts" />
/// <reference path="../libs/node/node.d.ts" />
/// <reference path="../libs/express/express.d.ts" />
/// <reference path="../libs/serve-static/serve-static.d.ts" />
/// <reference path="../libs/socket.io/socket.io.d.ts" />
/// <reference path="../libs/log4js/log4js.d.ts" />
/// <reference path="../libs/ws/ws.d.ts" />
/// <reference path="../libs/long/long.d.ts" />
/// <reference path="../libs/bytebuffer/bytebuffer.d.ts" />
/// <reference path="../libs/protobufjs/protobufjs.d.ts" />

declare module events {
    export class EventEmitter {
        addListener(event: string, listener: Function): EventEmitter;
        on(event: string, listener: Function): EventEmitter;
        once(event: string, listener: Function): EventEmitter;
        removeListener(event: string, listener: Function): EventEmitter;
        removeAllListeners(event?: string): EventEmitter;
        setMaxListeners(n: number): void;
        listeners(event: string): Function[];
        emit(event: string, ...args: any[]): boolean;
    }
}
declare module ws {
    export class WebSocket {
        static CONNECTING: number;
        static OPEN: number;
        static CLOSING: number;
        static CLOSED: number;

        bytesReceived: number;
        readyState: number;
        protocolVersion: string;
        url: string;
        supports: any;

        CONNECTING: number;
        OPEN: number;
        CLOSING: number;
        CLOSED: number;

        close(code?: number, data?: any): void;
        pause(): void;
        resume(): void;
        ping(data?: any, options?: {mask?: boolean; binary?: boolean}, dontFail?: boolean): void;
        pong(data?: any, options?: {mask?: boolean; binary?: boolean}, dontFail?: boolean): void;
        send(data: any, cb?: (err: Error) => void): void;
        send(data: any, options: {mask?: boolean; binary?: boolean}, cb?: (err: Error) => void): void;
        stream(options: {mask?: boolean; binary?: boolean}, cb?: (err: Error, final: boolean) => void): void;
        stream(cb?: (err: Error, final: boolean) => void): void;
        terminate(): void;

        // HTML5 WebSocket events
        addEventListener(method: 'message', cb?: (event: {data: any; type: string; target: WebSocket}) => void): void;
        addEventListener(method: 'close', cb?: (event: {wasClean: boolean; code: number;
                                                        reason: string; target: WebSocket}) => void): void;
        addEventListener(method: 'error', cb?: (err: Error) => void): void;
        addEventListener(method: 'open', cb?: (event: {target: WebSocket}) => void): void;
        addEventListener(method: string, listener?: () => void): void;

        // Events
        on(event: 'error', cb: (err: Error) => void): WebSocket;
        on(event: 'close', cb: (code: number, message: string) => void): WebSocket;
        on(event: 'message', cb: (data: any, flags: {binary: boolean}) => void): WebSocket;
        on(event: 'ping', cb: (data: any, flags: {binary: boolean}) => void): WebSocket;
        on(event: 'pong', cb: (data: any, flags: {binary: boolean}) => void): WebSocket;
        on(event: 'open', cb: () => void): WebSocket;
        on(event: string, listener: () => void): WebSocket;
    }
}
