

import { HttpInterceptorFn, HttpRequest,HttpHandlerFn,HttpResponse } from "@angular/common/http";   
import { LoginResponse } from "@core/models/auth.model";
import { Observable,of,delay,pipe } from "rxjs";





export const mockApiInterceptor: HttpInterceptorFn = (
     req: HttpRequest<unknown>,
    next: HttpHandlerFn
   ) => {
   
    const url = req.url;
    const method = req.method;
    if(url.endsWith('/auth/login') && method === 'POST'){

        return handleLogin(req);
    }

    return next(req);

  } 
  
  
  function handleLogin(req: HttpRequest<unknown>):Observable<HttpResponse<LoginResponse>> {
    const body = req.body as { username: string; password: string };
    
     if(body?.username && body?.password){
       const response: LoginResponse = {
        token: 'mock-jwt-token' + Math.random().toString(36).substring(2),
        user: {
          id: 1,
          username: body.username,  
          displayName : body.username.charAt(0).toUpperCase() + body.username.slice(1),
          role : 'admin'
        },
        expiresIn: 3600
       };
       return of(new HttpResponse({ status:200 , body: response })).pipe(delay(500));
    }

    return of(new HttpResponse({ status: 401, body: null as unknown as LoginResponse})).pipe(delay(500)); 
  }