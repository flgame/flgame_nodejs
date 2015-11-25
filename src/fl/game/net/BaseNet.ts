module fl {
	export class BaseNet {

		public static EVENT_NET_ERR:string = "NetErrorEvent";
		public static EVENT_CLIENT_CLOSE:string = "NetClientCloseEvent";

		public ip:string;
		public port:number;
		public id:string;
		private dataCache_:Array<egret.ByteArray> = new Array<egret.ByteArray>();
		public socket:SocketIO.Socket;
		protected _cachCmd:boolean = false;
		protected _cachQueue:Array<any>;
        private _receBytes:egret.ByteArray;

		public constructor(socket:SocketIO.Socket)
		{
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

		public close()
		{
			if(this.socket.connected)
			{
				this.socket.disconnect(true);
			}
			this.dataCache_ = new Array<egret.ByteArray>();
		}

		public forceClose()
		{
			this.close();
			fl.eventMgr.dispatchEvent(new fl.GlobalEvent(fl.BaseNet.EVENT_CLIENT_CLOSE));
		}

		protected onConnect()
		{
			var data:egret.ByteArray = this.dataCache_.shift();
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

		protected onClose()
		{
			fl.logger.info('client disconnected ' + this.ip + ":" + this.port);
			this.notifyClose();
		}

		public send(bytes:egret.ByteArray)
		{
			if(this.socket.connected)
			{
				this.socket.send(bytes.buffer);
			}
			else
			{
				this.dataCache_.push(bytes);
			}
		}

        protected onReceived(data:ArrayBuffer)
        {
            var tempBytes:egret.ByteArray = new egret.ByteArray(data);
            if(tempBytes.length == 0)
            {
                return ;
            }
            this._receBytes.position = this._receBytes.length;
            this._receBytes.writeBytes(tempBytes,0,tempBytes.length);
            while(this.processPacks());
        }

        private processPacks():boolean
        {
            var _self__:any = this;
            if(this._receBytes.length < fl.BasePack.HEAD_SIZE)
            {
                return false;
            }
            this._receBytes.position = 0;
            var firstPackageLenght:number = this._receBytes.readUnsignedShort();
            firstPackageLenght = firstPackageLenght + fl.BasePack.HEAD_SIZE;
            if(this._receBytes.length < firstPackageLenght)
            {
                return false;
            }
            if(firstPackageLenght > 2 * fl.BasePack.MAX_PACK_SIZE)
            {
                fl.logger.error("[BaseNet.processPacks] unknow package size: " + firstPackageLenght);
            }
            var tmpBytes:egret.ByteArray = new egret.ByteArray();
            tmpBytes.writeBytes(this._receBytes,0,fl.BasePack.HEAD_SIZE);
            var bodyBytes:egret.ByteArray = new egret.ByteArray();
            if(firstPackageLenght != fl.BasePack.HEAD_SIZE)
            {
                bodyBytes.writeBytes(this._receBytes,fl.BasePack.HEAD_SIZE,firstPackageLenght - fl.BasePack.HEAD_SIZE);
            }
            tmpBytes.position = 2;
            var protocolNumber:number = tmpBytes.readUnsignedInt();
            if(protocolNumber >>> 31 == 1)
            {
                fl.logger.info("compressed protocol: " + protocolNumber);
                protocolNumber = protocolNumber & 0x7FFFFFFF;
                //decryption
                bodyBytes = this.decryption(bodyBytes);
            }
            tmpBytes.position = fl.BasePack.HEAD_SIZE;
            if(bodyBytes.length)
            {
                tmpBytes.writeBytes(bodyBytes,0,bodyBytes.length);
                tmpBytes.position = fl.BasePack.HEAD_SIZE;
            }
            this.processOrCache(protocolNumber, tmpBytes);

            //reset left bytes
            tmpBytes = new egret.ByteArray();
            if(this._receBytes.length > firstPackageLenght)
            {
                tmpBytes.writeBytes(this._receBytes,firstPackageLenght,this._receBytes.length - firstPackageLenght);
            }
            this._receBytes.length = 0;
            this._receBytes.position = 0;
            if(tmpBytes.length > 0)
            {
                this._receBytes.writeBytes(tmpBytes,0,tmpBytes.length);
                return true;
            }
            else
            {
                return false;
            }
        }
        /**
         * decrypt the data if need
         **/
        protected decryption(bytes:egret.ByteArray)
        {
            return bytes;
        }
        public cachCmd(b:boolean)
        {
            this._cachCmd = b;
            if(b)
            {
                if(null == this._cachQueue)
                    this._cachQueue = [];
            }
            else
            {
                if(this._cachQueue != null)
                {
                    while(this._cachQueue.length > 0)
                    {
                        var cach:any = this._cachQueue.shift();
                        this.processCmd(cach["protocol"],cach["data"]);
                    }
                }
            }
        }

        protected noCachCmd(p:number):boolean
        {
            return false;
        }
        protected processOrCache(protocol:number,data:egret.ByteArray)
        {
            if(false == this._cachCmd || this.noCachCmd(protocol))
                this.processCmd(protocol,data);
            else
                this._cachQueue.push({protocol:protocol,data:data});
        }
        protected processCmd(protocol:number,data:egret.ByteArray)
        {
            var tick:number = Date.now();
            var action:fl.BaseAction = fl.actionMgr.getAction(protocol);
            if(action)
            {
                action.process(data,protocol);
            }
            else
            {
                action = fl.actionMgr.getAction(fl.Protocol.getProtocolType(protocol));
                if(action)
                {
                    action.process(data,protocol);
                }
                else
                {
                    fl.logger.error("[BaseNet.processCmd] unknow protocol " + protocol);
                }
            }
            var diffTick:number = Date.now() - tick;
            if(diffTick >= 50)
            {
                fl.logger.warn("[BaseNet.processCmd] handeltime: id:" + protocol + " time:" + diffTick);
            }
        }
	}
}
