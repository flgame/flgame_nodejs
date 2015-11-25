module fl {
	export class Protocol {
		public static CMD_TYPE_BASE:number = 100000;
		public static getProtocolType(p:number):number
		{
			p = p / fl.Protocol.CMD_TYPE_BASE;
			return Math.floor(p);
		}
		public static protocolEvent(v:number):string
		{
			return "EVENT_PROTOCOL_" + v;
		}
	}
}
