export class GanttSlot{
    public id: any;
    public label: string;
    public content: any;
    public metaData: any;

    constructor(objMap: any){
        this.id = objMap.id;
        this.label = objMap.label;
        this.content = objMap.content;
        this.metaData = objMap.metaData;
    }
}