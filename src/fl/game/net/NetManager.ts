module fl {
	export class NetManager {
		public static instance_:fl.NetManager;
		public static getInstance():fl.NetManager
		{
			if(null == fl.NetManager.instance_)
			{
				fl.NetManager.instance_ = new fl.NetManager();
			}
			return fl.NetManager.instance_;
		}

		private netCache_:fl.Dictionary = new fl.Dictionary();
		public addNet(socket:SocketIO.Socket,netClass:any = null):fl.BaseNet
		{
			var net:fl.BaseNet;
			netClass = netClass || fl.BaseNet;
			net = new netClass(socket);
			this.netCache_.setItem(net.id,net);
			return net;
		}

		public getNet(id:string):fl.BaseNet
		{
			var net:fl.BaseNet = <any>this.netCache_.getItem(id);
			return net;
		}

		public setNet(net:fl.BaseNet,id:string):fl.BaseNet
		{
			if(this.netCache_.getItem(id))
			{
				this.removeNet(id);
			}
			this.netCache_.setItem(id,net);
			return net;
		}

		public removeNet(id:string):fl.BaseNet
		{
			var net:fl.BaseNet = null;
			if(this.netCache_.hasOwnProperty(id))
			{
				net = this.netCache_.getItem(id);
				net.close();
				this.netCache_.delItem(id);
			}
			return net;
		}

		public sendPack(pack:fl.BasePack,netId:string)
		{
			this.sendBytes(pack.getBytes(),netId);
		}

		public sendBytes(bytes:egret.ByteArray,netId:string)
		{
			var net:fl.BaseNet = this.getNet(netId);
			net.send(bytes);
		}

	}

	export var netMgr:fl.NetManager = fl.NetManager.getInstance();
}
