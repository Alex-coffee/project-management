export class ProcessResult{
    constructor(
        public processId: number,
        public earlistFinishTime: number,
        public earlistStartTime: number,
        public isCritical: boolean,
        public latestFinishTime: number,
        public latestStartTime: number
    ){}
}