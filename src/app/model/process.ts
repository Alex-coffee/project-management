export class Process {
    constructor(
        public processId: number,
        public order: number,
        public name: string,
        public time: number,
        public line: number,
        public nextProcessVec: any[],
        public rawMaterial: any[],
        public worker: any[]
    ){}
}
