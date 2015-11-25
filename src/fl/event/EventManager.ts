module fl {
	export class EventManager extends events.EventEmitter {

		public static instance_:fl.EventManager;
		public static getInstance():fl.EventManager
		{
			fl.EventManager.instance_ = fl.EventManager.instance_ || new fl.EventManager();
			return fl.EventManager.instance_;
		}

		public hasEventListener(type:string):boolean {
			var arr:Function[] = this.listeners(type);
			return arr && arr.length > 0;
		}

		public dispatchEvent(event:fl.GlobalEvent):boolean
		{
            return this.emit(event.type, event.data);
		}

		private eventListeners_:fl.Dictionary = new fl.Dictionary();
        public addEventListener(type:string,listener:Function):events.EventEmitter
        {
            return this.addListener(type, listener);
        }
		public addListener(type:string,listener:Function):events.EventEmitter
		{
            var e:events.EventEmitter = this;
			var tmpType:string = type;
			var listeners:Array<any> = <any>this.eventListeners_.getItem(tmpType);
			if(listeners == null)
			{
				listeners = new Array();
				this.eventListeners_.setItem(tmpType,listeners);
			}
			var i:number = listeners.indexOf(listener);
			if(i == -1)
			{
				e = super.addListener(type,listener);
				listeners.push(listener);
			}
            return e;
		}

		public removeEventListener(type:string,listener:Function):events.EventEmitter
		{
			return this.removeListener(type, listener);
		}
        public removeListener(type:string,listener:Function):events.EventEmitter
        {
            var e:events.EventEmitter = this;
            var tmpType:string = type;
            var listeners:Array<any> = <any>this.eventListeners_.getItem(tmpType);
            var i:number = listeners?listeners.indexOf(listener):-1;
            if(i != -1)
            {
                e = super.removeListener(type,listener);
                listeners.splice(i,1);
            }
            return e;
        }

		public removeListeners(type:string = null):events.EventEmitter
		{
            var e:events.EventEmitter = this;
			var tmpType:string;
			if(type)
			{
				tmpType = type;
				var listeners:Array<any> = <any>this.eventListeners_.getItem(tmpType);
				for(var listener_key_a in listeners)
				{
					var listener:Function = listeners[listener_key_a];
					this.removeEventListener(type,listener);
				}
				this.eventListeners_.delItem(tmpType);
			}
			else
			{
				for(var forinvar__ in this.eventListeners_.map)
				{
					tmpType = this.eventListeners_.map[forinvar__][0];
					if(tmpType)
					{
						this.removeListeners(tmpType);
					}
				}
			}
            return e;
		}

		public removeAllListeners():events.EventEmitter
		{
            var e:events.EventEmitter = this;
			this.removeListeners(null);
            return e;
		}
	}
	export var eventMgr:EventManager = fl.EventManager.getInstance();
}
