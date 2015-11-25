module fl {
	export class InjectionPoint {


		public constructor(injector:fl.Injector)
		{
		}

		public applyInjection(target:any,injector:fl.Injector):any
		{
			return target;
		}
	}
}

