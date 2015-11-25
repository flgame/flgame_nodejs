/// <reference path="../libs/mime/mime.d.ts" />
/// <reference path="../libs/node/node.d.ts" />
/// <reference path="../libs/express/express.d.ts" />
/// <reference path="../libs/serve-static/serve-static.d.ts" />
/// <reference path="../libs/socket.io/socket.io.d.ts" />
/// <reference path="../libs/log4js/log4js.d.ts" />
/// <reference path="../libs/bytearray_egret/bytearray_egret.d.ts" />

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