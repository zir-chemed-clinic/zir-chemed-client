import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentDTO } from '../models/PaymentDTO';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpClient) {}

getIframeHtml(paymentData: PaymentDTO)  {
  return this.http.post("/api/Payment", paymentData, { responseType: 'text' });
}

receiptForCash(paymentData: PaymentDTO): Observable<string> {
  return this.http.post('/api/payment/receipt', paymentData, { responseType: 'text' });
}
receiptForCheck(paymentData: PaymentDTO): Observable<any> {
  return this.http.post('/api/payment/check', paymentData);
}
}
