module fl {
	export class BaseAction {

		public eventMgr:fl.EventManager = fl.eventMgr;
		public netMgr:fl.NetManager = fl.netMgr;
		public netId:string;
		public process(data:ByteBuffer,protocol:number = 0)
		{
		}

		public sendPack(pack:fl.BasePack,netId:string = "")
		{
			this.netMgr.sendPack(pack,netId || this.netId);
		}

		public sendBytes(bytes:ByteBuffer,netId:string = "")
		{
			this.netMgr.sendBytes(bytes,netId || this.netId);
		}

		public dispatchEvent(e:fl.GlobalEvent)
		{
			this.eventMgr.dispatchEvent(e);
		}

	}
}
