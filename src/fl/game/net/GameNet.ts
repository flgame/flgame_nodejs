module fl {
	export class GameNet extends fl.BaseNet {


		public constructor(socket:SocketIO.Socket)
		{
			super(socket);
			this.cachCmd(true);
		}

		protected noCachCmd(p:number):boolean
		{
			return false;
		}
	}
}
