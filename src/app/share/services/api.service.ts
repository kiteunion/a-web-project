import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {
  }

}
