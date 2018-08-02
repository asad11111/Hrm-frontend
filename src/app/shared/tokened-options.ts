import {RequestOptions, RequestMethod, Headers, RequestOptionsArgs, BaseRequestOptions} from '@angular/http';
import {Injectable} from "@angular/core";

@Injectable()
export class TokenedOptions extends BaseRequestOptions {
    
    merge(options: RequestOptionsArgs): RequestOptions{
      if(options.headers == null){
        options.headers = new Headers();
      }
      options.headers.set('x-access-token', localStorage.getItem('_token'));
      options.headers.set('Timezone-Offset', (new Date).getTimezoneOffset().toString());
      return super.merge(options);
    }
    
}