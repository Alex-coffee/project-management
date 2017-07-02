import { GanttItem } from 'app/model/gantt-item';
import { GanttSlot } from 'app/model/gantt-slot';

export class GanttDataSet{
    constructor(
        public ganttItems: GanttItem[], 
        public ganttSlots: GanttSlot[], 
        public startTime: number, 
        public endTime: number
    ){}
}