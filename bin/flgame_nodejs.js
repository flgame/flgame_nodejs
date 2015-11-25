/**
 * Created by feir on 2015/11/24.
 */
var log4js = require('log4js');
var fl;
(function (fl) {
    fl.logger = log4js.getLogger("flgame");
})(fl || (fl = {}));
/**
 * Created by feir on 2015/11/14.
 */
var fl;
(function (fl) {
    function isNumber(value) {
        var type = (typeof value);
        if (type === "object") {
            type = Object.prototype.toString.call(value);
            return type === "[object Number]";
        }
        else {
            return type === "number";
        }
    }
    fl.isNumber = isNumber;
    function isString(value) {
        var type = (typeof value);
        if (type === "object") {
            type = Object.prototype.toString.call(value);
            return type === "[object String]";
        }
        else {
            return type === "string";
        }
    }
    fl.isString = isString;
    function isArray(value) {
        if (Array.isArray)
            return Array.isArray(value);
        if (value)
            return Object.prototype.toString.call(value) === "[object Array]";
    }
    fl.isArray = isArray;
    function isObject(value) {
        var type = (typeof value);
        return type === "object";
    }
    fl.isObject = isObject;
    function isClass(value) {
        var type = (typeof value);
        return type === "function";
    }
    fl.isClass = isClass;
    function is(value, superValue) {
        if (value === superValue)
            return true;
        if (!value || !superValue)
            return false;
        var types;
        if (isString(value)) {
            types = [value];
        }
        else {
            var proto = value.prototype ? value.prototype : Object.getPrototypeOf(value);
            types = proto ? proto.__types__ : null;
            if (!types) {
                return false;
            }
        }
        superValue = getClassName(superValue);
        return (types.indexOf(superValue) !== -1);
    }
    fl.is = is;
    function getClassName(value, replaceColons) {
        if (replaceColons === void 0) { replaceColons = false; }
        var fqcn;
        if (fl.isString(value)) {
            fqcn = value;
        }
        else {
            fqcn = getQualifiedClassName(value);
        }
        return replaceColons ? fqcn.replace('::', '.') : fqcn;
    }
    fl.getClassName = getClassName;
    function getQualifiedClassName(value) {
        var type = typeof value;
        if (!value || (type != "object" && !value.prototype)) {
            return type;
        }
        var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if (prototype.hasOwnProperty("__class__")) {
            return prototype["__class__"];
        }
        var constructorString = prototype.constructor.toString();
        var index = constructorString.indexOf("(");
        var className = constructorString.substring(9, index);
        Object.defineProperty(prototype, "__class__", {
            value: className,
            enumerable: false,
            writable: true
        });
        return className;
    }
    fl.getQualifiedClassName = getQualifiedClassName;
    var getDefinitionByNameCache = {};
    function getDefinitionByName(name) {
        if (!name)
            return null;
        var definition = getDefinitionByNameCache[name];
        if (definition) {
            return definition;
        }
        var paths = name.split(".");
        var length = paths.length;
        definition = __global;
        for (var i = 0; i < length; i++) {
            var path = paths[i];
            definition = definition[path];
            if (!definition) {
                return null;
            }
        }
        getDefinitionByNameCache[name] = definition;
        return definition;
    }
    fl.getDefinitionByName = getDefinitionByName;
    //START: ------ string utils ------
    function isWhitespace(character) {
        switch (character) {
            case " ":
            case "\t":
            case "\r":
            case "\n":
            case "\f":
                return true;
            default:
                return false;
        }
    }
    fl.isWhitespace = isWhitespace;
    function substitute(str) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (str == null)
            return '';
        var len = rest.length;
        var args;
        if (len == 1 && fl.isArray(rest[0])) {
            args = rest[0];
            len = args.length;
        }
        else {
            args = rest;
        }
        for (var i = 0; i < len; i++) {
            str = str.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
        }
        return str;
    }
    fl.substitute = substitute;
    function joinLines(value) {
        fl.LINE_BREAKS.lastIndex = 0;
        return value ? value.replace(fl.LINE_BREAKS, "") : value;
    }
    fl.joinLines = joinLines;
    function toFixed(value, p, trimZero) {
        if (p === void 0) { p = 2; }
        if (trimZero === void 0) { trimZero = true; }
        var tmpS = value.toFixed(p);
        if (trimZero && p > 0) {
            for (var i = tmpS.length - 1; i >= 0; i--) {
                var tmpC = tmpS.charAt(i);
                if (tmpC == '.') {
                    break;
                }
                else if (tmpC != '0') {
                    i++;
                    break;
                }
            }
            tmpS = tmpS.substring(0, i);
        }
        return tmpS;
    }
    fl.toFixed = toFixed;
    function replaceText(s, ft, tt) {
        return s.split(ft).join(tt);
    }
    fl.replaceText = replaceText;
    function stringFullMatch(source, target) {
        var tmpResult = false;
        if (source == target) {
            tmpResult = true;
        }
        else if (source == null || target == null) {
            tmpResult = false;
        }
        else {
            var tmpReg = new RegExp('^' + target + '$', 'm');
            tmpResult = (null != source.match(tmpReg));
        }
        return tmpResult;
    }
    fl.stringFullMatch = stringFullMatch;
    function formatHtml(s, color, size, bold, under, italic, face) {
        if (color === void 0) { color = null; }
        if (size === void 0) { size = null; }
        if (bold === void 0) { bold = false; }
        if (under === void 0) { under = false; }
        if (italic === void 0) { italic = false; }
        if (face === void 0) { face = "SimSun"; }
        var sc = "";
        if (color != null) {
            sc = fl.getColorStr(fl.getColor(color));
            sc = "color='" + sc + "'";
        }
        var ss = "";
        if (size != null) {
            ss = "size='" + size + "'";
        }
        var sf = "";
        if (face != null) {
            sf = "face='" + face + "'";
        }
        var template = fl.substitute(fl.COLOR_TEXT, sc, ss, sf, s);
        if (bold) {
            template = "<b>" + template + "</b>";
        }
        if (under) {
            template = "<u>" + template + "</u>";
        }
        if (italic) {
            template = "<i>" + template + "</i>";
        }
        return template;
    }
    fl.formatHtml = formatHtml;
    function getWordWidth(value) {
        var tmpResult = 0;
        for (var i = 0; i < value.length; i++) {
            var tmpC = value.charCodeAt(i);
            if (tmpC >= 0 && tmpC <= 126) {
                tmpResult += 1;
            }
            else {
                tmpResult += 2;
            }
        }
        return tmpResult;
    }
    fl.getWordWidth = getWordWidth;
    function strByteLen(str) {
        var byteLen = 0;
        if (!str)
            return 0;
        var strLen = str.length;
        for (var i = 0; i < strLen; i++) {
            byteLen += str.charCodeAt(i) >= 0x7F ? 2 : 1;
        }
        return byteLen;
    }
    fl.strByteLen = strByteLen;
    function repeatStr(str, count) {
        var s = "";
        for (var i = 0; i < count; i++) {
            s += str;
        }
        return s;
    }
    fl.repeatStr = repeatStr;
    function complementByChar(str, length, char, ignoreHtml) {
        if (ignoreHtml === void 0) { ignoreHtml = true; }
        var byteLen = fl.strByteLen(ignoreHtml ? str.replace(fl.HTML_TAG, "") : str);
        return str + fl.repeatStr(char, length - byteLen);
    }
    fl.complementByChar = complementByChar;
    //END:------ string utils ------
    //START:------ color utils -----
    function adjustBrightness(rgb, brite) {
        var r = Math.max(Math.min(((rgb >> 16) & 0xFF) + brite, 255), 0);
        var g = Math.max(Math.min(((rgb >> 8) & 0xFF) + brite, 255), 0);
        var b = Math.max(Math.min((rgb & 0xFF) + brite, 255), 0);
        return (r << 16) | (g << 8) | b;
    }
    fl.adjustBrightness = adjustBrightness;
    function adjustBrightness2(rgb, brite) {
        var r = 0;
        var g = 0;
        var b = 0;
        if (brite == 0)
            return rgb;
        if (brite < 0) {
            brite = (100 + brite) / 100;
            r = ((rgb >> 16) & 0xFF) * brite;
            g = ((rgb >> 8) & 0xFF) * brite;
            b = (rgb & 0xFF) * brite;
        }
        else {
            brite /= 100;
            r = ((rgb >> 16) & 0xFF);
            g = ((rgb >> 8) & 0xFF);
            b = (rgb & 0xFF);
            r += ((0xFF - r) * brite);
            g += ((0xFF - g) * brite);
            b += ((0xFF - b) * brite);
            r = Math.min(r, 255);
            g = Math.min(g, 255);
            b = Math.min(b, 255);
        }
        return (r << 16) | (g << 8) | b;
    }
    fl.adjustBrightness2 = adjustBrightness2;
    function rgbMultiply(rgb1, rgb2) {
        var r1 = (rgb1 >> 16) & 0xFF;
        var g1 = (rgb1 >> 8) & 0xFF;
        var b1 = rgb1 & 0xFF;
        var r2 = (rgb2 >> 16) & 0xFF;
        var g2 = (rgb2 >> 8) & 0xFF;
        var b2 = rgb2 & 0xFF;
        return ((r1 * r2 / 255) << 16) | ((g1 * g2 / 255) << 8) | (b1 * b2 / 255);
    }
    fl.rgbMultiply = rgbMultiply;
    function getColorStr(color) {
        var result = "#";
        result += color.toString(16);
        return result;
    }
    fl.getColorStr = getColorStr;
    function getColorInt(color) {
        return Number("0x" + color.substr(1, color.length));
    }
    fl.getColorInt = getColorInt;
    function getColor(color) {
        var n = 0;
        if (fl.isString(color)) {
            if (String(color).charAt(0) == "#") {
                n = fl.getColorInt(color);
            }
            else {
                n = Number(color);
            }
        }
        else {
            n = Number(color);
        }
        return n;
    }
    fl.getColor = getColor;
})(fl || (fl = {}));
fl.LINE_BREAKS = new RegExp("[\r\n]+", "img");
fl.COLOR_TEXT = "\<font {0} {1} {2}\>{3}\</font\>";
fl.HTML_TAG = /<[^>]+>/g;
var __global = __global || global;
/**
 * Created by huitao on 2015/6/25.
 */
var fl;
(function (fl) {
    var Dictionary = (function () {
        function Dictionary(weak) {
            this.map = new Array();
        }
        Dictionary.prototype.getItem = function (key, val) {
            for (var i = 0; i < this.map.length; i++) {
                if (this.map[i][0] == key)
                    return this.map[i][1];
            }
            if (val) {
                this.map.push([key, val]);
            }
            return val;
        };
        Dictionary.prototype.setItem = function (key, val) {
            for (var i = 0; i < this.map.length; i++) {
                if (this.map[i][0] == key) {
                    this.map[i][1] = val;
                    return;
                }
            }
            this.map.push([key, val]);
            return val;
        };
        Dictionary.prototype.delItem = function (key) {
            for (var i = 0; i < this.map.length; i++) {
                if (this.map[i][0] == key) {
                    this.map.splice(i, 1);
                    break;
                }
            }
        };
        Dictionary.prototype.hasOwnProperty = function (key) {
            if (this.map == undefined || this.map.length == undefined) {
                return false;
            }
            for (var i = 0; i < this.map.length; i++) {
                if (this.map[i][0] == key) {
                    return true;
                }
            }
            return false;
        };
        return Dictionary;
    })();
    fl.Dictionary = Dictionary;
})(fl || (fl = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fl;
(function (fl) {
    var EventManager = (function (_super) {
        __extends(EventManager, _super);
        function EventManager() {
            _super.apply(this, arguments);
            this.eventListeners_ = new fl.Dictionary();
        }
        EventManager.getInstance = function () {
            fl.EventManager.instance_ = fl.EventManager.instance_ || new fl.EventManager();
            return fl.EventManager.instance_;
        };
        EventManager.prototype.hasEventListener = function (type) {
            var arr = this.listeners(type);
            return arr && arr.length > 0;
        };
        EventManager.prototype.dispatchEvent = function (event) {
            return this.emit(event.type, event.data);
        };
        EventManager.prototype.addEventListener = function (type, listener) {
            return this.addListener(type, listener);
        };
        EventManager.prototype.addListener = function (type, listener) {
            var e = this;
            var tmpType = type;
            var listeners = this.eventListeners_.getItem(tmpType);
            if (listeners == null) {
                listeners = new Array();
                this.eventListeners_.setItem(tmpType, listeners);
            }
            var i = listeners.indexOf(listener);
            if (i == -1) {
                e = _super.prototype.addListener.call(this, type, listener);
                listeners.push(listener);
            }
            return e;
        };
        EventManager.prototype.removeEventListener = function (type, listener) {
            return this.removeListener(type, listener);
        };
        EventManager.prototype.removeListener = function (type, listener) {
            var e = this;
            var tmpType = type;
            var listeners = this.eventListeners_.getItem(tmpType);
            var i = listeners ? listeners.indexOf(listener) : -1;
            if (i != -1) {
                e = _super.prototype.removeListener.call(this, type, listener);
                listeners.splice(i, 1);
            }
            return e;
        };
        EventManager.prototype.removeListeners = function (type) {
            if (type === void 0) { type = null; }
            var e = this;
            var tmpType;
            if (type) {
                tmpType = type;
                var listeners = this.eventListeners_.getItem(tmpType);
                for (var listener_key_a in listeners) {
                    var listener = listeners[listener_key_a];
                    this.removeEventListener(type, listener);
                }
                this.eventListeners_.delItem(tmpType);
            }
            else {
                for (var forinvar__ in this.eventListeners_.map) {
                    tmpType = this.eventListeners_.map[forinvar__][0];
                    if (tmpType) {
                        this.removeListeners(tmpType);
                    }
                }
            }
            return e;
        };
        EventManager.prototype.removeAllListeners = function () {
            var e = this;
            this.removeListeners(null);
            return e;
        };
        return EventManager;
    })(events.EventEmitter);
    fl.EventManager = EventManager;
    fl.eventMgr = fl.EventManager.getInstance();
})(fl || (fl = {}));
var fl;
(function (fl) {
    var GlobalEvent = (function () {
        function GlobalEvent(type, data) {
            if (data === void 0) { data = null; }
            this.type = type;
            this.data = data;
        }
        GlobalEvent.prototype.clone = function () {
            var tmpEvent = new fl.GlobalEvent(this.type, this.data);
            return tmpEvent;
        };
        return GlobalEvent;
    })();
    fl.GlobalEvent = GlobalEvent;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var ActionManager = (function () {
        function ActionManager() {
            this.actionCache_ = new fl.Dictionary();
            this.actionClazz_ = [];
        }
        ActionManager.getInstance = function () {
            if (null == fl.ActionManager.instance_) {
                fl.ActionManager.instance_ = new fl.ActionManager();
            }
            return fl.ActionManager.instance_;
        };
        ActionManager.prototype.initActions = function (injector) {
            if (injector === void 0) { injector = null; }
            this.injector_ = injector || fl.injector;
            this.injector_.mapValue(fl.ActionManager, this);
        };
        ActionManager.prototype.injectAction = function (actionClass) {
            var tmpI = this.actionClazz_.indexOf(actionClass);
            if (this.injector_ && actionClass && tmpI == -1) {
                this.injector_.mapSingleton(actionClass);
                var action = this.injector_.getInstance(actionClass);
                this.mapAction(action);
                this.actionClazz_.push(actionClass);
            }
        };
        ActionManager.prototype.uninjectAction = function (actionClass) {
            var tmpI = this.actionClazz_.indexOf(actionClass);
            if (this.injector_ && actionClass && tmpI >= 0) {
                var action = this.injector_.getInstance(actionClass);
                this.unmapAction(action);
                this.injector_.unmap(actionClass);
                this.actionClazz_.splice(tmpI, 1);
            }
        };
        ActionManager.prototype.mapAction = function (action) {
            if (action) {
                for (var protocol_key_a in action.protocols) {
                    var protocol = action.protocols[protocol_key_a];
                    if (protocol != null)
                        this.setAction(action, protocol);
                }
            }
        };
        ActionManager.prototype.unmapAction = function (action) {
            for (var forinvar__ in this.actionCache_.map) {
                var key = this.actionCache_.map[forinvar__][0];
                if (this.actionCache_.getItem(key) == action) {
                    this.actionCache_.delItem(key);
                }
            }
        };
        ActionManager.prototype.getActionByClass = function (actionClass) {
            var action;
            var tmpI = this.actionClazz_.indexOf(actionClass);
            if (this.injector_ && actionClass && tmpI != -1) {
                action = this.injector_.getInstance(actionClass);
            }
            return action;
        };
        ActionManager.prototype.getAction = function (id) {
            var action = this.actionCache_.getItem(id);
            return action;
        };
        ActionManager.prototype.setAction = function (action, id) {
            if (this.actionCache_.getItem(id)) {
                this.removeAction(id);
            }
            this.actionCache_.setItem(id, action);
            return action;
        };
        ActionManager.prototype.removeAction = function (id) {
            var action = null;
            if (this.actionCache_.hasOwnProperty(id)) {
                action = this.actionCache_.getItem(id);
                this.actionCache_.delItem(id);
            }
            return action;
        };
        return ActionManager;
    })();
    fl.ActionManager = ActionManager;
    fl.actionMgr = fl.ActionManager.getInstance();
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Actions = (function () {
        function Actions() {
        }
        Actions.init = function () {
            if (fl.Actions.inited)
                return;
            fl.Actions.inited = true;
            //inject actions
        };
        Actions.injectAction = function (actionClass) {
            fl.actionMgr.injectAction(actionClass);
        };
        Actions.uninjectAction = function (actionClass) {
            fl.actionMgr.uninjectAction(actionClass);
        };
        Actions.inited = false;
        return Actions;
    })();
    fl.Actions = Actions;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var BaseAction = (function () {
        function BaseAction() {
            this.eventMgr = fl.eventMgr;
            this.netMgr = fl.netMgr;
        }
        Object.defineProperty(BaseAction.prototype, "protocols", {
            get: function () {
                return this.mapProtocols;
            },
            set: function (value) {
                this.mapProtocols = value;
            },
            enumerable: true,
            configurable: true
        });
        BaseAction.prototype.process = function (data, protocol) {
            if (protocol === void 0) { protocol = 0; }
        };
        BaseAction.prototype.sendPack = function (pack, netId) {
            if (netId === void 0) { netId = ""; }
            this.netMgr.sendPack(pack, netId);
        };
        BaseAction.prototype.sendBytes = function (bytes, netId) {
            if (netId === void 0) { netId = ""; }
            this.netMgr.sendBytes(bytes, netId);
        };
        BaseAction.prototype.dispatchEvent = function (e) {
            this.eventMgr.dispatchEvent(e);
        };
        return BaseAction;
    })();
    fl.BaseAction = BaseAction;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var BaseNet = (function () {
        function BaseNet(socket) {
            this.dataCache_ = new Array();
            this._cachCmd = false;
            this.socket = socket;
            this.id = socket.id;
            this.ip = socket.request.connection.remoteAddress;
            this.port = socket.request.connection.remotePort;
            this._receBytes = new egret.ByteArray();
            fl.logger.info('client connected ' + this.ip + ":" + this.port);
            this.socket.on("message", this.onReceived);
            this.socket.on("disconnect", this.onClose);
            this.onConnect();
        }
        BaseNet.prototype.close = function () {
            if (this.socket.connected) {
                this.socket.disconnect(true);
            }
            this.dataCache_ = new Array();
        };
        BaseNet.prototype.forceClose = function () {
            this.close();
            fl.eventMgr.dispatchEvent(new fl.GlobalEvent(fl.BaseNet.EVENT_CLIENT_CLOSE));
        };
        BaseNet.prototype.onConnect = function () {
            var data = this.dataCache_.shift();
            while (data) {
                this.send(data);
                data = this.dataCache_.shift();
            }
        };
        BaseNet.prototype.notifyClose = function () {
            fl.eventMgr.dispatchEvent(new fl.GlobalEvent(fl.BaseNet.EVENT_NET_ERR, this.id));
        };
        BaseNet.prototype.onClose = function () {
            fl.logger.info('client disconnected ' + this.ip + ":" + this.port);
            this.notifyClose();
        };
        BaseNet.prototype.send = function (bytes) {
            if (this.socket.connected) {
                this.socket.send(bytes.buffer);
            }
            else {
                this.dataCache_.push(bytes);
            }
        };
        BaseNet.prototype.onReceived = function (data) {
            var tempBytes = new egret.ByteArray(data);
            if (tempBytes.length == 0) {
                return;
            }
            this._receBytes.position = this._receBytes.length;
            this._receBytes.writeBytes(tempBytes, 0, tempBytes.length);
            while (this.processPacks())
                ;
        };
        BaseNet.prototype.processPacks = function () {
            var _self__ = this;
            if (this._receBytes.length < fl.BasePack.HEAD_SIZE) {
                return false;
            }
            this._receBytes.position = 0;
            var firstPackageLenght = this._receBytes.readUnsignedShort();
            firstPackageLenght = firstPackageLenght + fl.BasePack.HEAD_SIZE;
            if (this._receBytes.length < firstPackageLenght) {
                return false;
            }
            if (firstPackageLenght > 2 * fl.BasePack.MAX_PACK_SIZE) {
                fl.logger.error("[BaseNet.processPacks] unknow package size: " + firstPackageLenght);
            }
            var tmpBytes = new egret.ByteArray();
            tmpBytes.writeBytes(this._receBytes, 0, fl.BasePack.HEAD_SIZE);
            var bodyBytes = new egret.ByteArray();
            if (firstPackageLenght != fl.BasePack.HEAD_SIZE) {
                bodyBytes.writeBytes(this._receBytes, fl.BasePack.HEAD_SIZE, firstPackageLenght - fl.BasePack.HEAD_SIZE);
            }
            tmpBytes.position = 2;
            var protocolNumber = tmpBytes.readUnsignedInt();
            if (protocolNumber >>> 31 == 1) {
                fl.logger.info("compressed protocol: " + protocolNumber);
                protocolNumber = protocolNumber & 0x7FFFFFFF;
                //decryption
                bodyBytes = this.decryption(bodyBytes);
            }
            tmpBytes.position = fl.BasePack.HEAD_SIZE;
            if (bodyBytes.length) {
                tmpBytes.writeBytes(bodyBytes, 0, bodyBytes.length);
                tmpBytes.position = fl.BasePack.HEAD_SIZE;
            }
            this.processOrCache(protocolNumber, tmpBytes);
            //reset left bytes
            tmpBytes = new egret.ByteArray();
            if (this._receBytes.length > firstPackageLenght) {
                tmpBytes.writeBytes(this._receBytes, firstPackageLenght, this._receBytes.length - firstPackageLenght);
            }
            this._receBytes.length = 0;
            this._receBytes.position = 0;
            if (tmpBytes.length > 0) {
                this._receBytes.writeBytes(tmpBytes, 0, tmpBytes.length);
                return true;
            }
            else {
                return false;
            }
        };
        /**
         * decrypt the data if need
         **/
        BaseNet.prototype.decryption = function (bytes) {
            return bytes;
        };
        BaseNet.prototype.cachCmd = function (b) {
            this._cachCmd = b;
            if (b) {
                if (null == this._cachQueue)
                    this._cachQueue = [];
            }
            else {
                if (this._cachQueue != null) {
                    while (this._cachQueue.length > 0) {
                        var cach = this._cachQueue.shift();
                        this.processCmd(cach["protocol"], cach["data"]);
                    }
                }
            }
        };
        BaseNet.prototype.noCachCmd = function (p) {
            return false;
        };
        BaseNet.prototype.processOrCache = function (protocol, data) {
            if (false == this._cachCmd || this.noCachCmd(protocol))
                this.processCmd(protocol, data);
            else
                this._cachQueue.push({ protocol: protocol, data: data });
        };
        BaseNet.prototype.processCmd = function (protocol, data) {
            var tick = Date.now();
            var action = fl.actionMgr.getAction(protocol);
            if (action) {
                action.process(data, protocol);
            }
            else {
                action = fl.actionMgr.getAction(fl.Protocol.getProtocolType(protocol));
                if (action) {
                    action.process(data, protocol);
                }
                else {
                    fl.logger.error("[BaseNet.processCmd] unknow protocol " + protocol);
                }
            }
            var diffTick = Date.now() - tick;
            if (diffTick >= 50) {
                fl.logger.warn("[BaseNet.processCmd] handeltime: id:" + protocol + " time:" + diffTick);
            }
        };
        BaseNet.EVENT_NET_ERR = "NetErrorEvent";
        BaseNet.EVENT_CLIENT_CLOSE = "NetClientCloseEvent";
        return BaseNet;
    })();
    fl.BaseNet = BaseNet;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var BasePack = (function () {
        function BasePack(id) {
            this.id = 0;
            this.size = 0;
            this.result = 0;
            this.id = id;
        }
        BasePack.prototype.getBytes = function () {
            var bytes = new egret.ByteArray();
            bytes.position = 2;
            bytes.writeUnsignedInt(this.id);
            this.toBytes(bytes);
            bytes.position = 0;
            this.size = bytes.length - fl.BasePack.HEAD_SIZE;
            bytes.writeUnsignedShort(this.size);
            return bytes;
        };
        BasePack.prototype.toBytes = function (bytes) {
        };
        BasePack.prototype.writeBytes = function (bytes) {
            this.toBytes(bytes);
        };
        BasePack.prototype.setBytes = function (bytes) {
            bytes.position = fl.BasePack.HEAD_SIZE;
            this.fromBytes(bytes);
            this.dealError(this.result);
        };
        BasePack.prototype.fromBytes = function (bytes) {
        };
        BasePack.prototype.readBytes = function (bytes) {
            this.fromBytes(bytes);
        };
        BasePack.prototype.resetBytesPos = function (bytes) {
            bytes.position = fl.BasePack.HEAD_SIZE;
        };
        BasePack.prototype.dealError = function (err) {
            if (err != 0) {
                fl.eventMgr.dispatchEvent(new fl.GlobalEvent(fl.BasePack.EVENT_PACK_ERR, err));
                fl.logger.error("[BasePack.dealError] " + this.id + ":" + err);
            }
        };
        BasePack.EVENT_PACK_ERR = "PackErrorEvent";
        BasePack.HEAD_SIZE = 6;
        BasePack.MAX_PACK_SIZE = 65536;
        return BasePack;
    })();
    fl.BasePack = BasePack;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var GameNet = (function (_super) {
        __extends(GameNet, _super);
        function GameNet(socket) {
            _super.call(this, socket);
            this.cachCmd(true);
        }
        GameNet.prototype.noCachCmd = function (p) {
            return false;
        };
        return GameNet;
    })(fl.BaseNet);
    fl.GameNet = GameNet;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var NetManager = (function () {
        function NetManager() {
            this.netCache_ = new fl.Dictionary();
        }
        NetManager.getInstance = function () {
            if (null == fl.NetManager.instance_) {
                fl.NetManager.instance_ = new fl.NetManager();
            }
            return fl.NetManager.instance_;
        };
        NetManager.prototype.addNet = function (socket, netClass) {
            if (netClass === void 0) { netClass = null; }
            var net;
            netClass = netClass || fl.BaseNet;
            net = new netClass(socket);
            this.netCache_.setItem(net.id, net);
            return net;
        };
        NetManager.prototype.getNet = function (id) {
            var net = this.netCache_.getItem(id);
            return net;
        };
        NetManager.prototype.setNet = function (net, id) {
            if (this.netCache_.getItem(id)) {
                this.removeNet(id);
            }
            this.netCache_.setItem(id, net);
            return net;
        };
        NetManager.prototype.removeNet = function (id) {
            var net = null;
            if (this.netCache_.hasOwnProperty(id)) {
                net = this.netCache_.getItem(id);
                net.close();
                this.netCache_.delItem(id);
            }
            return net;
        };
        NetManager.prototype.sendPack = function (pack, netId) {
            this.sendBytes(pack.getBytes(), netId);
        };
        NetManager.prototype.sendBytes = function (bytes, netId) {
            var net = this.getNet(netId);
            net.send(bytes);
        };
        return NetManager;
    })();
    fl.NetManager = NetManager;
    fl.netMgr = fl.NetManager.getInstance();
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Protocol = (function () {
        function Protocol() {
        }
        Protocol.getProtocolType = function (p) {
            p = p / fl.Protocol.CMD_TYPE_BASE;
            return Math.floor(p);
        };
        Protocol.protocolEvent = function (v) {
            return "EVENT_PROTOCOL_" + v;
        };
        Protocol.CMD_TYPE_BASE = 100000;
        return Protocol;
    })();
    fl.Protocol = Protocol;
})(fl || (fl = {}));
var fl;
(function (fl) {
    fl.IInjector = "fl.IInjector";
})(fl || (fl = {}));
var fl;
(function (fl) {
    var InjectionConfig = (function () {
        function InjectionConfig(request, injectionName) {
            this.request = request;
            this.injectionName = injectionName;
        }
        InjectionConfig.prototype.getResponse = function (injector) {
            var ij = this.m_injector || injector;
            if (this.m_result) {
                return this.m_result.getResponse(ij);
            }
            var parentConfig = ij.getAncestorMapping(this.request, this.injectionName);
            if (parentConfig) {
                return parentConfig.getResponse(injector);
            }
            return null;
        };
        InjectionConfig.prototype.hasResponse = function (injector) {
            if (this.m_result) {
                return true;
            }
            var ij = this.m_injector || injector;
            var parentConfig = ij.getAncestorMapping(this.request, this.injectionName);
            return parentConfig != null;
        };
        InjectionConfig.prototype.hasOwnResponse = function () {
            return this.m_result != null;
        };
        InjectionConfig.prototype.setResult = function (result) {
            if (this.m_result != null && result != null) {
                console.log('Warning: Injector already has a rule for type "' + fl.getClassName(this.request) + '", named "' + this.injectionName + '".\n ' + 'If you have overwritten this mapping intentionally you can use ' + '"injector.unmap()" prior to your replacement mapping in order to ' + 'avoid seeing this message.');
            }
            this.m_result = result;
        };
        InjectionConfig.prototype.setInjector = function (injector) {
            this.m_injector = injector;
        };
        return InjectionConfig;
    })();
    fl.InjectionConfig = InjectionConfig;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var InjectionType = (function () {
        function InjectionType() {
        }
        return InjectionType;
    })();
    fl.InjectionType = InjectionType;
})(fl || (fl = {}));
fl.InjectionType.VALUE = 0;
fl.InjectionType.CLASS = 1;
fl.InjectionType.SINGLETON = 2;
var fl;
(function (fl) {
    fl.injector = Injector.getInstance();
    var Injector = (function () {
        function Injector() {
            this.m_mappings = new fl.Dictionary();
            this.m_injecteeDescriptions = fl.Injector.INJECTION_POINTS_CACHE;
            this.m_attendedToInjectees = new fl.Dictionary(true);
        }
        Injector.getInstance = function () {
            Injector.instance_ = Injector.instance_ || new Injector();
            return Injector.instance_;
        };
        Injector.prototype.mapValue = function (whenAskedFor, useValue, named) {
            if (named === void 0) { named = ""; }
            var config = this.getMapping(whenAskedFor, named);
            config.setResult(new fl.InjectValueResult(useValue));
            return config;
        };
        Injector.prototype.mapClass = function (whenAskedFor, instantiateClass, named) {
            if (named === void 0) { named = ""; }
            var config = this.getMapping(whenAskedFor, named);
            config.setResult(new fl.InjectClassResult(instantiateClass));
            return config;
        };
        Injector.prototype.mapSingleton = function (whenAskedFor, named) {
            if (named === void 0) { named = ""; }
            return this.mapSingletonOf(whenAskedFor, whenAskedFor, named);
        };
        Injector.prototype.mapSingletonOf = function (whenAskedFor, useSingletonOf, named) {
            if (named === void 0) { named = ""; }
            var config = this.getMapping(whenAskedFor, named);
            config.setResult(new fl.InjectSingletonResult(useSingletonOf));
            return config;
        };
        Injector.prototype.mapRule = function (whenAskedFor, useRule, named) {
            if (named === void 0) { named = ""; }
            var config = this.getMapping(whenAskedFor, named);
            config.setResult(new fl.InjectOtherRuleResult(useRule));
            return useRule;
        };
        Injector.prototype.getMapping = function (whenAskedFor, named) {
            if (named === void 0) { named = ""; }
            var requestName = fl.getClassName(whenAskedFor);
            var config = this.m_mappings.getItem(requestName + '#' + named);
            if (!config) {
                config = this.m_mappings.setItem(requestName + '#' + named, new fl.InjectionConfig(whenAskedFor, named));
            }
            return config;
        };
        Injector.prototype.injectInto = function (target) {
            if (this.m_attendedToInjectees.getItem(target)) {
                return;
            }
            this.m_attendedToInjectees.setItem(target, true);
        };
        Injector.prototype.instantiate = function (clazz) {
            var injecteeDescription = this.m_injecteeDescriptions.getItem(clazz);
            if (!injecteeDescription) {
                injecteeDescription = this.getInjectionPoints(clazz);
            }
            var injectionPoint = injecteeDescription.ctor;
            var instance = injectionPoint.applyInjection(clazz, this);
            this.injectInto(instance);
            return instance;
        };
        Injector.prototype.unmap = function (clazz, named) {
            if (named === void 0) { named = ""; }
            var mapping = this.getConfigurationForRequest(clazz, named);
            if (!mapping) {
                throw new fl.InjectorError('Error while removing an injector mapping: ' + 'No mapping defined for class ' + fl.getClassName(clazz) + ', named "' + named + '"');
            }
            mapping.setResult(null);
        };
        Injector.prototype.hasMapping = function (clazz, named) {
            if (named === void 0) { named = ''; }
            var mapping = this.getConfigurationForRequest(clazz, named);
            if (!mapping) {
                return false;
            }
            return mapping.hasResponse(this);
        };
        Injector.prototype.getInstance = function (clazz, named) {
            if (named === void 0) { named = ''; }
            var mapping = this.getConfigurationForRequest(clazz, named);
            if (!mapping || !mapping.hasResponse(this)) {
                throw new fl.InjectorError('Error while getting mapping response: ' + 'No mapping defined for class ' + fl.getClassName(clazz) + ', named "' + named + '"');
            }
            return mapping.getResponse(this);
        };
        Injector.prototype.createChildInjector = function () {
            var injector = new fl.Injector();
            injector.setParentInjector(this);
            return injector;
        };
        Injector.prototype.setParentInjector = function (parentInjector) {
            if (this.m_parentInjector && !parentInjector) {
                this.m_attendedToInjectees = new fl.Dictionary(true);
            }
            this.m_parentInjector = parentInjector;
            if (parentInjector) {
                this.m_attendedToInjectees = parentInjector.attendedToInjectees;
            }
        };
        Injector.prototype.getParentInjector = function () {
            return this.m_parentInjector;
        };
        Injector.purgeInjectionPointsCache = function () {
            fl.Injector.INJECTION_POINTS_CACHE = new fl.Dictionary(true);
        };
        Injector.prototype.getAncestorMapping = function (whenAskedFor, named) {
            if (named === void 0) { named = null; }
            var parent = this.m_parentInjector;
            while (parent) {
                var parentConfig = parent.getConfigurationForRequest(whenAskedFor, named, false);
                if (parentConfig && parentConfig.hasOwnResponse()) {
                    return parentConfig;
                }
                parent = parent.getParentInjector();
            }
            return null;
        };
        Object.defineProperty(Injector.prototype, "attendedToInjectees", {
            get: function () {
                return this.m_attendedToInjectees;
            },
            set: function (value) {
                this.m_attendedToInjectees = value;
            },
            enumerable: true,
            configurable: true
        });
        Injector.prototype.getInjectionPoints = function (clazz) {
            var injectionPoints = [];
            var ctorInjectionPoint = new fl.NoParamsConstructorInjectionPoint();
            var injecteeDescription = new InjecteeDescription(ctorInjectionPoint, injectionPoints);
            this.m_injecteeDescriptions.setItem(clazz, injecteeDescription);
            return injecteeDescription;
        };
        Injector.prototype.getConfigurationForRequest = function (clazz, named, traverseAncestors) {
            if (traverseAncestors === void 0) { traverseAncestors = true; }
            var requestName = fl.getClassName(clazz);
            var config = this.m_mappings.getItem(requestName + '#' + named);
            if (!config && traverseAncestors && this.m_parentInjector && this.m_parentInjector.hasMapping(clazz, named)) {
                config = this.getAncestorMapping(clazz, named);
            }
            return config;
        };
        return Injector;
    })();
    fl.Injector = Injector;
    var InjecteeDescription = (function () {
        function InjecteeDescription(ctor, injectionPoints) {
            this.ctor = ctor;
            this.injectionPoints = injectionPoints;
        }
        return InjecteeDescription;
    })();
})(fl || (fl = {}));
fl.Injector.INJECTION_POINTS_CACHE = new fl.Dictionary(true);
var fl;
(function (fl) {
    var InjectorError = (function (_super) {
        __extends(InjectorError, _super);
        function InjectorError(message, id) {
            if (message === void 0) { message = ""; }
            if (id === void 0) { id = 0; }
            _super.call(this, message);
            this.name = id;
        }
        return InjectorError;
    })(Error);
    fl.InjectorError = InjectorError;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var InjectionPoint = (function () {
        function InjectionPoint(injector) {
        }
        InjectionPoint.prototype.applyInjection = function (target, injector) {
            return target;
        };
        return InjectionPoint;
    })();
    fl.InjectionPoint = InjectionPoint;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var NoParamsConstructorInjectionPoint = (function (_super) {
        __extends(NoParamsConstructorInjectionPoint, _super);
        function NoParamsConstructorInjectionPoint() {
            _super.call(this, null);
        }
        NoParamsConstructorInjectionPoint.prototype.applyInjection = function (target, injector) {
            return new target();
        };
        return NoParamsConstructorInjectionPoint;
    })(fl.InjectionPoint);
    fl.NoParamsConstructorInjectionPoint = NoParamsConstructorInjectionPoint;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var InjectClassResult = (function (_super) {
        __extends(InjectClassResult, _super);
        function InjectClassResult(responseType) {
            _super.call(this);
            this.m_responseType = responseType;
        }
        InjectClassResult.prototype.getResponse = function (injector) {
            return injector.instantiate(this.m_responseType);
        };
        return InjectClassResult;
    })(fl.InjectionResult);
    fl.InjectClassResult = InjectClassResult;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var InjectOtherRuleResult = (function (_super) {
        __extends(InjectOtherRuleResult, _super);
        function InjectOtherRuleResult(rule) {
            _super.call(this);
            this.m_rule = rule;
        }
        InjectOtherRuleResult.prototype.getResponse = function (injector) {
            return this.m_rule.getResponse(injector);
        };
        return InjectOtherRuleResult;
    })(fl.InjectionResult);
    fl.InjectOtherRuleResult = InjectOtherRuleResult;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var InjectSingletonResult = (function (_super) {
        __extends(InjectSingletonResult, _super);
        function InjectSingletonResult(responseType) {
            _super.call(this);
            this.m_responseType = responseType;
        }
        InjectSingletonResult.prototype.getResponse = function (injector) {
            return this.m_response = this.m_response || this.createResponse(injector);
        };
        InjectSingletonResult.prototype.createResponse = function (injector) {
            return injector.instantiate(this.m_responseType);
        };
        return InjectSingletonResult;
    })(fl.InjectionResult);
    fl.InjectSingletonResult = InjectSingletonResult;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var InjectValueResult = (function (_super) {
        __extends(InjectValueResult, _super);
        function InjectValueResult(value) {
            _super.call(this);
            this.m_value = value;
        }
        InjectValueResult.prototype.getResponse = function (injector) {
            return this.m_value;
        };
        return InjectValueResult;
    })(fl.InjectionResult);
    fl.InjectValueResult = InjectValueResult;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var InjectionResult = (function () {
        function InjectionResult() {
        }
        InjectionResult.prototype.getResponse = function (injector) {
            return null;
        };
        return InjectionResult;
    })();
    fl.InjectionResult = InjectionResult;
})(fl || (fl = {}));
//# sourceMappingURL=flgame_nodejs.js.map