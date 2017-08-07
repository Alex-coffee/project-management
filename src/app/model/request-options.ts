export class RequestOptions {
    public selectFields: any;
    public sortFields: any;
    public populateFields: any;
    public currentPage: number;
    public pageSize: number;

    constructor(options: any){
        if(options){
            this.selectFields = options.selectFields;
            this.sortFields = options.sortFields;
            this.populateFields = options.populateFields;
            this.currentPage = options.currentPage;
            this.pageSize = options.pageSize;
        }
    }
}
