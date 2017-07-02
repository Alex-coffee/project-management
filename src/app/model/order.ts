export class Order{
    constructor(
        public orderName: string,
        public unitCost: number,
        public initialStorage: number,
        public safeStorage: number,
        public demands: number[]
    ){}
}