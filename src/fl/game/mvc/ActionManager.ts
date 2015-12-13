module fl {
	export class ActionManager {
		private static actionCache_:fl.Dictionary = new fl.Dictionary();
		private static actionClazz_:Array<any> = [];
		public static injectAction(actionClass:any)
		{
			var tmpI:number = ActionManager.actionClazz_.indexOf(actionClass);
			if(actionClass && tmpI == -1)
			{
				ActionManager.mapAction(actionClass);
				ActionManager.actionClazz_.push(actionClass);
			}
		}

		public static uninjectAction(actionClass:any)
		{
			var tmpI:number = ActionManager.actionClazz_.indexOf(actionClass);
			if(actionClass && tmpI >= 0)
			{
				ActionManager.unmapAction(actionClass);
				ActionManager.actionClazz_.splice(tmpI,1);
			}
		}

		public static mapAction(action:any)
		{
			if(action)
			{
				for(var protocol_key_a in action.protocols)
				{
					var protocol:any = action.protocols[protocol_key_a];
					if(protocol != null)
						ActionManager.setAction(action,protocol);
				}
			}
		}

		public static unmapAction(action:any)
		{
			for(var forinvar__ in ActionManager.actionCache_.map)
			{
				var key = ActionManager.actionCache_.map[forinvar__][0];
				if(ActionManager.actionCache_.getItem(key) == action)
				{
					ActionManager.actionCache_.delItem(key);
				}
			}
		}
		
		public static getAction(id:any):any
		{
			return ActionManager.actionCache_.getItem(id);
		}

		public static setAction(action:any,id:any):any
		{
			if(ActionManager.actionCache_.getItem(id))
			{
				ActionManager.removeAction(id);
			}
			ActionManager.actionCache_.setItem(id,action);
			return action;
		}

		public static removeAction(id:any):any
		{
			var action:any;
			if(ActionManager.actionCache_.hasOwnProperty(id))
			{
				action = ActionManager.actionCache_.getItem(id);
				ActionManager.actionCache_.delItem(id);
			}
			return action;
		}
		
		public injector_:IInjector;
		public net:BaseNet;
		public constructor(net:BaseNet, injector?:IInjector) {
			this.net = net;
			this.injector_ = injector || new fl.Injector();
			this.injector_.mapValue(fl.BaseNet,this.net);
			this.injector_.mapValue(fl.ActionManager,this);
		}
		
		public getActionByClass(actionClass:any):fl.BaseAction
		{
			var action:fl.BaseAction;
			if(this.injector_ && actionClass)
			{
				if(!this.injector_.hasMapping(actionClass)) {
					this.injector_.mapSingleton(actionClass);
				}
				action = this.injector_.getInstance(actionClass);
				action.netId = this.net.id;
			}
			return action;
		}

		public getAction(id:any):fl.BaseAction
		{
			return this.getActionByClass(ActionManager.getAction(id));
		}
	}
}
