module fl {
	export class GlobalEvent {

		public type:string;
		public data:any;

		public constructor(type:string,data:any = null)
		{
			this.type = type;
			this.data = data;
		}

		public clone():fl.GlobalEvent
		{
			var tmpEvent:fl.GlobalEvent = new fl.GlobalEvent(this.type,this.data);
			return tmpEvent;
		}

	}
}
