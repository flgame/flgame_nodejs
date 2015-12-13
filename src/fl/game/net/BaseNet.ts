module fl {
	export class BaseNet {

		public static EVENT_NET_ERR:string = "NetErrorEvent";
		public static EVENT_CLIENT_CLOSE:string = "NetClientCloseEvent";
        public static ID:number = 0;
        public static generateID():string {
            BaseNet.ID ++;
            return BaseNet.ID + "-" + Date.now();
        }
        public url:string;
		public ip:string;
		public port:number;
		public id:string;
		public socket:ws.WebSocket;
        public actionMgr:fl.ActionManager;
		private dataCache_:Array<ByteBuffer> = new Array<ByteBuffer>();
		protected _cachCmd:boolean = false;
		protected _cachQueue:Array<any>;
        private _receBytes:ByteBuffer;
        
		public constructor(socket:ws.WebSocket)
		{
            var __self__:BaseNet = this;
			this.socket = socket;
            this.actionMgr = new fl.ActionManager(this);
            this.id = BaseNet.generateID();
            // this.ip = socket.request.connection.remoteAddress;
            // this.port = socket.request.connection.remotePort;
            this._receBytes = new ByteBuffer(fl.BasePack.BUFFER_SIZE).flip();

            fl.logger.info('client connected ' + this.id + ":" + this.url);
            this.socket.on("message", function() {
                __self__.onReceived.apply(__self__, arguments);
            });
            this.socket.on("close", function() {
                __self__.onClose.apply(__self__, arguments);
            });
            this.socket.on("error", function() {
                __self__.onError.apply(__self__, arguments);
            });

            this.onConnect();
		}
        
		public close()
		{
			if(this.socket.readyState == this.socket.CONNECTING || this.socket.readyState == this.socket.OPEN)
			{
				this.socket.close();
			}
			this.dataCache_ = new Array<ByteBuffer>();
		}

		public forceClose()
		{
			this.close();
			fl.eventMgr.dispatchEvent(new fl.GlobalEvent(fl.BaseNet.EVENT_CLIENT_CLOSE,this.id));
		}

		protected onConnect()
		{
			var data:ByteBuffer = this.dataCache_.shift();
			while(data)
			{
				this.send(data);
				data = this.dataCache_.shift();
			}
		}

		protected notifyClose()
		{
			fl.eventMgr.dispatchEvent(new fl.GlobalEvent(fl.BaseNet.EVENT_NET_ERR,this.id));
		}

		protected onClose(code:number, message:string)
		{
			fl.logger.info('client disconnected ' + this.id + ":" + this.url + ", code: " + code + ", message: " + message);
			this.notifyClose();
		}
        protected onError(error:Error)
		{
			fl.logger.info('client error ' + this.id + ":" + this.url + ", error: " + error);
			this.notifyClose();
		}
        
		public send(bytes:ByteBuffer)
		{
			if(this.socket.readyState == this.socket.OPEN)
			{
				this.socket.send(bytes.toArrayBuffer(), {binary: true});
			}
			else
			{
				this.dataCache_.push(bytes);
			}
		}

        protected onReceived(data:ArrayBuffer, flags?:any)
        {
            if(data.byteLength == 0)
            {
                return ;
            }
            this._receBytes.offset = this._receBytes.limit;
            this._receBytes.append(data).flip();
            while(this.processPacks());
        }

        private processPacks(): boolean {
            if (this._receBytes.limit < fl.BasePack.HEAD_SIZE) {
                return false;
            }
            this._receBytes.offset = 0;
            var firstPackageLenght: number = this._receBytes.readUint16();
            firstPackageLenght = firstPackageLenght + fl.BasePack.HEAD_SIZE;
            if (this._receBytes.limit < firstPackageLenght) {
                return false;
            }
            if (firstPackageLenght > 2 * fl.BasePack.MAX_PACK_SIZE) {
                throw new Error("[BaseSocket.processPacks] unknow package size: " + firstPackageLenght);
            }
            var tmpBytes: ByteBuffer = this._receBytes.copy(0, fl.BasePack.HEAD_SIZE).flip();
            var bodyBytes: ByteBuffer = new ByteBuffer().flip();
            var n:number = firstPackageLenght - fl.BasePack.HEAD_SIZE;
            if (n > 0) {
                this._receBytes.copyTo(bodyBytes, 0, fl.BasePack.HEAD_SIZE, firstPackageLenght);
                bodyBytes.offset = n;
                bodyBytes.flip();
            }
            tmpBytes.offset = 2;
            var protocolNumber: number = tmpBytes.readUint32();
            if (protocolNumber >>> 31 == 1) {
                fl.logger("compressed protocol: " + protocolNumber);
                protocolNumber = protocolNumber & 0x7FFFFFFF;
                //decryption
                bodyBytes = this.decryption(bodyBytes);
            }
            tmpBytes.offset = fl.BasePack.HEAD_SIZE;
            if (bodyBytes.limit) {
                tmpBytes.mark();
                tmpBytes.append(bodyBytes).flip();
                tmpBytes.reset();
            }
            this.processOrCache(protocolNumber, tmpBytes);

            //reset left bytes
            tmpBytes = new ByteBuffer().flip();
            n = this._receBytes.limit - firstPackageLenght;
            if (n > 0) {
                this._receBytes.copyTo(tmpBytes, 0, firstPackageLenght, this._receBytes.limit);
                tmpBytes.offset = n;
                tmpBytes.flip();
            }
            this._receBytes.clear().flip();
            if (tmpBytes.limit > 0) {
                this._receBytes.append(tmpBytes).flip();
                return true;
            }
            else {
                return false;
            }
        }
        /**
         * decrypt the data if need
         **/
        protected decryption(bytes: ByteBuffer) {
            return bytes;
        }
        public cachCmd(b: boolean) {
            this._cachCmd = b;
            if (b) {
                if (null == this._cachQueue)
                    this._cachQueue = [];
            }
            else {
                if (this._cachQueue != null) {
                    while (this._cachQueue.length > 0) {
                        var cach: any = this._cachQueue.shift();
                        this.processCmd(cach["protocol"], cach["data"]);
                    }
                }
            }
        }

        protected noCachCmd(p: number): boolean {
            return false;
        }
        protected processOrCache(protocol: number, data: ByteBuffer) {
            if (false == this._cachCmd || this.noCachCmd(protocol))
                this.processCmd(protocol, data);
            else
                this._cachQueue.push({ protocol: protocol, data: data });
        }
        protected processCmd(protocol: number, data: ByteBuffer) {
            var tick: number = Date.now();
            var action: fl.BaseAction = this.actionMgr.getAction(protocol);
            if (action) {
                action.process(data, protocol);
            }
            else {
                action = this.actionMgr.getAction(fl.Protocol.getProtocolType(protocol));
                if (action) {
                    action.process(data, protocol);
                }
                else {
                    fl.logger.error("[BaseNet.processCmd] unknow protocol " + protocol);
                }
            }
            var diffTick: number = Date.now() - tick;
            if (diffTick >= 50) {
                fl.logger.warn("[BaseNet.processCmd] handeltime: id:" + protocol + " time:" + diffTick);
            }
        }
	}
}
