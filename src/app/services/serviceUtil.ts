import { HTTP_BASE } from 'app/config';

export class ServiceUtil {
  private HOST:string = HTTP_BASE;

  private queryURL = '/api/find/model';
  private saveURL = '/api/save/model';
  private deleteURL = '/api/delete/model';

  constructor() { }


}
