module fl {
	export class BasePack {

		public static EVENT_PACK_ERR:string = "PackErrorEvent";
		public static HEAD_SIZE:number = 6;
		public static MAX_PACK_SIZE:number = 65536;
		public static BUFFER_SIZE:number = 1024;
		public id:number = 0;
		public size:number = 0;
		public result:number = 0;
		public protoModel:any;
		public protoValue:any;
		
		public constructor(id:number)
		{
			this.id = id;
		}

		public getBytes():ByteBuffer
		{
			var bytes:ByteBuffer = new ByteBuffer().flip();
			bytes.offset = 2;
			bytes.writeUint32(this.id);
			this.toBytes(bytes);
			bytes.flip();
			this.size = bytes.limit - fl.BasePack.HEAD_SIZE;
			bytes.writeUint16(this.size);
			bytes.offset = 0;
			return bytes;
		}

		protected toBytes(bytes:ByteBuffer)
		{
			if(this.protoValue) {
				BasePack.writeProtoModel(this.protoValue, bytes);
			}
		}

		public writeBytes(bytes:ByteBuffer)
		{
			this.toBytes(bytes);
		}

		public setBytes(bytes:ByteBuffer)
		{
			bytes.offset = fl.BasePack.HEAD_SIZE;
			this.fromBytes(bytes);
			this.dealError(this.result);
		}

		protected fromBytes(bytes:ByteBuffer)
		{
			if(this.protoModel) {
				this.protoValue = BasePack.readProtoModel(this.protoModel, bytes);
			}
		}

		public readBytes(bytes:ByteBuffer)
		{
			this.fromBytes(bytes);
		}

		public resetBytesPos(bytes:ByteBuffer)
		{
			bytes.offset = fl.BasePack.HEAD_SIZE;
		}

		protected dealError(err:number)
		{
			if(err != 0)
			{
				fl.eventMgr.dispatchEvent(new GlobalEvent(fl.BasePack.EVENT_PACK_ERR,err));
				fl.logger.error("[BasePack.dealError] " + this.id + ":" + err);
			}
		}

		public static readProtoModel(m:any, bytes:ByteBuffer, length:number = -1):any {
			var v:any;
			if(length < 0) {
				length = bytes.readUint32();
			} else if(length == 0) {
				length = bytes.limit - bytes.offset;
			}
			var n:number = bytes.offset + length;
			var tmpBytes:ByteBuffer = bytes.copy(bytes.offset, n).flip();
			bytes.offset = n;
			v = m.decode(tmpBytes.buffer);
			return v;
		}
		public static writeProtoModel(v:any, bytes:ByteBuffer):ByteBuffer {
			var tmpBytes:ByteBuffer = ByteBuffer.wrap(v.toArrayBuffer());
			if(bytes) {
				bytes.writeUint32(tmpBytes.limit);
				bytes.append(tmpBytes);
			}
			return tmpBytes;
		}
	}
}
