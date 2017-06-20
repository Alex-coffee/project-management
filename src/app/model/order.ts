export class Order{
    constructor(
        public orderId: number,
        public amount: number,
        public dueDate: string,
        public level: number
    ){}
}