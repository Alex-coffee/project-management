export class GanttSlot{
    public id: any;
    public label: string;
    public content: any;

    constructor(objMap: any){
        this.id = objMap.id;
        this.label = objMap.label;
        this.content = objMap.content;
    }
}