/**
 * Created by feir on 2015/11/24.
 */
declare var log4js: any;
declare module fl {
    var logger: any;
}
/**
 * Created by feir on 2015/11/14.
 */
declare module fl {
    function isNumber(value: any): boolean;
    function isString(value: any): boolean;
    function isArray(value: any): boolean;
    function isObject(value: any): boolean;
    function isClass(value: any): boolean;
    function is(value: any, superValue: any): boolean;
    function getClassName(value: any, replaceColons?: boolean): string;
    function getQualifiedClassName(value: any): string;
    function getDefinitionByName(name: string): any;
    function isWhitespace(character: string): boolean;
    function substitute(str: string, ...rest: any[]): string;
    var LINE_BREAKS: RegExp;
    function joinLines(value: string): string;
    function toFixed(value: number, p?: number, trimZero?: boolean): string;
    function replaceText(s: string, ft: string, tt: string): string;
    function stringFullMatch(source: string, target: string): boolean;
    var COLOR_TEXT: string;
    function formatHtml(s: string, color?: any, size?: any, bold?: boolean, under?: boolean, italic?: boolean, face?: string): string;
    function getWordWidth(value: string): number;
    function strByteLen(str: string): number;
    function repeatStr(str: string, count: number): string;
    var HTML_TAG: RegExp;
    function complementByChar(str: string, length: number, char: string, ignoreHtml?: boolean): string;
    function adjustBrightness(rgb: number, brite: number): number;
    function adjustBrightness2(rgb: number, brite: number): number;
    function rgbMultiply(rgb1: number, rgb2: number): number;
    function getColorStr(color: number): string;
    function getColorInt(color: string): number;
    function getColor(color: any): number;
}
declare var __global: any;
/**
 * Created by huitao on 2015/6/25.
 */
declare module fl {
    class Dictionary {
        map: Array<any>;
        constructor(weak?: boolean);
        getItem(key: any, val?: any): any;
        setItem(key: any, val: any): any;
        delItem(key: any): void;
        hasOwnProperty(key: any): boolean;
    }
}
declare module fl {
    class EventManager extends events.EventEmitter {
        static instance_: fl.EventManager;
        static getInstance(): fl.EventManager;
        hasEventListener(type: string): boolean;
        dispatchEvent(event: fl.GlobalEvent): boolean;
        private eventListeners_;
        addEventListener(type: string, listener: Function): events.EventEmitter;
        addListener(type: string, listener: Function): events.EventEmitter;
        removeEventListener(type: string, listener: Function): events.EventEmitter;
        removeListener(type: string, listener: Function): events.EventEmitter;
        removeListeners(type?: string): events.EventEmitter;
        removeAllListeners(): events.EventEmitter;
    }
    var eventMgr: EventManager;
}
declare module fl {
    class GlobalEvent {
        type: string;
        data: any;
        constructor(type: string, data?: any);
        clone(): fl.GlobalEvent;
    }
}
declare module fl {
    class ActionManager {
        private actionCache_;
        static instance_: fl.ActionManager;
        static getInstance(): fl.ActionManager;
        private injector_;
        initActions(injector?: fl.IInjector): void;
        private actionClazz_;
        injectAction(actionClass: any): void;
        uninjectAction(actionClass: any): void;
        mapAction(action: fl.BaseAction): void;
        unmapAction(action: fl.BaseAction): void;
        getActionByClass(actionClass: any): fl.BaseAction;
        getAction(id: any): fl.BaseAction;
        setAction(action: fl.BaseAction, id: any): fl.BaseAction;
        removeAction(id: any): fl.BaseAction;
    }
    var actionMgr: fl.ActionManager;
}
declare module fl {
    class Actions {
        static inited: boolean;
        static init(): void;
        static injectAction(actionClass: any): void;
        static uninjectAction(actionClass: any): void;
    }
}
declare module fl {
    class BaseAction {
        eventMgr: fl.EventManager;
        netMgr: fl.NetManager;
        protected mapProtocols: Array<any>;
        protocols: Array<any>;
        process(data: egret.ByteArray, protocol?: number): void;
        sendPack(pack: fl.BasePack, netId?: string): void;
        sendBytes(bytes: egret.ByteArray, netId?: string): void;
        dispatchEvent(e: fl.GlobalEvent): void;
    }
}
declare module fl {
    class BaseNet {
        static EVENT_NET_ERR: string;
        static EVENT_CLIENT_CLOSE: string;
        ip: string;
        port: number;
        id: string;
        private dataCache_;
        socket: SocketIO.Socket;
        protected _cachCmd: boolean;
        protected _cachQueue: Array<any>;
        private _receBytes;
        constructor(socket: SocketIO.Socket);
        close(): void;
        forceClose(): void;
        protected onConnect(): void;
        protected notifyClose(): void;
        protected onClose(): void;
        send(bytes: egret.ByteArray): void;
        protected onReceived(data: ArrayBuffer): void;
        private processPacks();
        /**
         * decrypt the data if need
         **/
        protected decryption(bytes: egret.ByteArray): egret.ByteArray;
        cachCmd(b: boolean): void;
        protected noCachCmd(p: number): boolean;
        protected processOrCache(protocol: number, data: egret.ByteArray): void;
        protected processCmd(protocol: number, data: egret.ByteArray): void;
    }
}
declare module fl {
    class BasePack {
        static EVENT_PACK_ERR: string;
        static HEAD_SIZE: number;
        static MAX_PACK_SIZE: number;
        id: number;
        size: number;
        result: number;
        constructor(id: number);
        getBytes(): egret.ByteArray;
        protected toBytes(bytes: egret.ByteArray): void;
        writeBytes(bytes: egret.ByteArray): void;
        setBytes(bytes: egret.ByteArray): void;
        protected fromBytes(bytes: egret.ByteArray): void;
        readBytes(bytes: egret.ByteArray): void;
        resetBytesPos(bytes: egret.ByteArray): void;
        protected dealError(err: number): void;
    }
}
declare module fl {
    class GameNet extends fl.BaseNet {
        constructor(socket: SocketIO.Socket);
        protected noCachCmd(p: number): boolean;
    }
}
declare module fl {
    class NetManager {
        static instance_: fl.NetManager;
        static getInstance(): fl.NetManager;
        private netCache_;
        addNet(socket: SocketIO.Socket, netClass?: any): fl.BaseNet;
        getNet(id: string): fl.BaseNet;
        setNet(net: fl.BaseNet, id: string): fl.BaseNet;
        removeNet(id: string): fl.BaseNet;
        sendPack(pack: fl.BasePack, netId: string): void;
        sendBytes(bytes: egret.ByteArray, netId: string): void;
    }
    var netMgr: fl.NetManager;
}
declare module fl {
    class Protocol {
        static CMD_TYPE_BASE: number;
        static getProtocolType(p: number): number;
        static protocolEvent(v: number): string;
    }
}
declare module fl {
    interface IInjector {
        mapValue(whenAskedFor: any, useValue: any, named?: string): any;
        mapClass(whenAskedFor: any, instantiateClass: any, named?: string): any;
        mapSingleton(whenAskedFor: any, named?: string): any;
        mapSingletonOf(whenAskedFor: any, useSingletonOf: any, named?: string): any;
        mapRule(whenAskedFor: any, useRule: any, named?: string): any;
        injectInto(target: any): any;
        instantiate(clazz: any): any;
        getInstance(clazz: any, named?: string): any;
        createChildInjector(): IInjector;
        unmap(clazz: any, named?: string): any;
        hasMapping(clazz: any, named?: string): boolean;
    }
    var IInjector: string;
}
declare module fl {
    class InjectionConfig {
        request: any;
        injectionName: string;
        private m_injector;
        private m_result;
        constructor(request: any, injectionName: string);
        getResponse(injector: fl.Injector): any;
        hasResponse(injector: fl.Injector): boolean;
        hasOwnResponse(): boolean;
        setResult(result: fl.InjectionResult): void;
        setInjector(injector: fl.Injector): void;
    }
}
declare module fl {
    class InjectionType {
        static VALUE: number;
        static CLASS: number;
        static SINGLETON: number;
    }
}
declare module fl {
    var injector: Injector;
    class Injector implements fl.IInjector {
        static instance_: Injector;
        static getInstance(): Injector;
        static INJECTION_POINTS_CACHE: fl.Dictionary;
        private m_parentInjector;
        private m_mappings;
        private m_injecteeDescriptions;
        private m_attendedToInjectees;
        constructor();
        mapValue(whenAskedFor: any, useValue: any, named?: string): any;
        mapClass(whenAskedFor: any, instantiateClass: any, named?: string): any;
        mapSingleton(whenAskedFor: any, named?: string): any;
        mapSingletonOf(whenAskedFor: any, useSingletonOf: any, named?: string): any;
        mapRule(whenAskedFor: any, useRule: any, named?: string): any;
        getMapping(whenAskedFor: any, named?: string): InjectionConfig;
        injectInto(target: any): void;
        instantiate(clazz: any): any;
        unmap(clazz: any, named?: string): void;
        hasMapping(clazz: any, named?: string): boolean;
        getInstance(clazz: any, named?: string): any;
        createChildInjector(): fl.Injector;
        setParentInjector(parentInjector: fl.Injector): void;
        getParentInjector(): fl.Injector;
        static purgeInjectionPointsCache(): void;
        getAncestorMapping(whenAskedFor: any, named?: string): InjectionConfig;
        attendedToInjectees: fl.Dictionary;
        private getInjectionPoints(clazz);
        private getConfigurationForRequest(clazz, named, traverseAncestors?);
    }
}
declare module fl {
    class InjectorError extends Error {
        constructor(message?: any, id?: any);
    }
}
declare module fl {
    class InjectionPoint {
        constructor(injector: fl.Injector);
        applyInjection(target: any, injector: fl.Injector): any;
    }
}
declare module fl {
    class NoParamsConstructorInjectionPoint extends fl.InjectionPoint {
        constructor();
        applyInjection(target: any, injector: fl.Injector): any;
    }
}
declare module fl {
    class InjectClassResult extends fl.InjectionResult {
        private m_responseType;
        constructor(responseType: any);
        getResponse(injector: fl.Injector): any;
    }
}
declare module fl {
    class InjectOtherRuleResult extends fl.InjectionResult {
        private m_rule;
        constructor(rule: fl.InjectionConfig);
        getResponse(injector: fl.Injector): any;
    }
}
declare module fl {
    class InjectSingletonResult extends fl.InjectionResult {
        private m_responseType;
        private m_response;
        constructor(responseType: any);
        getResponse(injector: fl.Injector): any;
        private createResponse(injector);
    }
}
declare module fl {
    class InjectValueResult extends fl.InjectionResult {
        private m_value;
        constructor(value: any);
        getResponse(injector: fl.Injector): any;
    }
}
declare module fl {
    class InjectionResult {
        constructor();
        getResponse(injector: fl.Injector): any;
    }
}
