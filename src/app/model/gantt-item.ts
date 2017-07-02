export class GanttItem{
    public id: any;
    public rowIndex: number;
    public assignedSlot: any;
    public startTime: number;
    public endTime: number;
    public label: string;
    public content: any

    constructor(objMap: any){
        this.id = objMap.id;
        this.rowIndex = objMap.rowIndex;
        this.assignedSlot = objMap.assignedSlot;
        this.startTime = objMap.startTime;
        this.endTime = objMap.endTime;
        this.label = objMap.label;
        this.content = objMap.content;
    }
}