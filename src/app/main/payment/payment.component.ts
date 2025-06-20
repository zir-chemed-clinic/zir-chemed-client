import { Component, Input, OnInit } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { PersonsService } from '../services/persons.service';
import { ClinicVisitsService } from '../services/clinic-visits.service';
import { TreatmentService } from '../services/treatment.service';
import { PersonsDTO } from '../models/PersonsDTO';
import { ClinicVisitsDTO } from '../models/ClinicVisitsDTO';
import { TreatmentsDTO } from '../models/TreatmentsDTO';
import { ProductDTO } from '../models/ProductDTO';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit {
  @Input() ClinicVisitsId: number;
  @Input() PaymentType: number;
  amount: number = 0;
  paymentSuccess: boolean=false;

checks: any[] = [
  {
    checkNumber: '',
    bankNumber: '',
    branchNumber: '',
    accountNumber: '',
    dueDate: '',
    amount: 0,
  }
];  
  person: PersonsDTO;
  clinicVisit: ClinicVisitsDTO;
  treatment: TreatmentsDTO;
  iframeHtml: string | null = null;
  iframeUrl: SafeResourceUrl | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private clinicVisitsService: ClinicVisitsService,
    private paymentService: PaymentService,
    private personsService: PersonsService,
    private treatmentService: TreatmentService
  ) {}

  ngOnInit() {
    this.clinicVisitsService.getById(this.ClinicVisitsId).subscribe({
      next: (visit) => {
        this.clinicVisit = visit;
        this.treatmentService.getById(this.clinicVisit.treatmentsId).subscribe({
          next: (treatment) => {
            this.treatment = treatment;
            this.personsService.getById(visit.personsId).subscribe({
              next: (person) => {
                this.person = person;
                if(this.PaymentType===1)
                    this.submitPayment();
                  else if(this.PaymentType===2)
                            this.submitReceiptByCash();
                  

              
              },
              error: () => alert('שגיאה בטעינת פרטי מטופל'),
            });
          },
          error: () => alert('שגיאה בטעינת טיפול'),
        });
      },
      error: () => alert('שגיאה בטעינת ביקור'),
    });

}
  

  submitPayment() {
    const products: ProductDTO[] = [];

    // מוצר נבחר (מתוך 4)
    products.push({
      catalogNumber: this.clinicVisit.treatmentsId,
      description: this.treatment.treatmentName,
      price: this.treatment.treatmentCost,
      quantity: 1
    });

    // מוצר קבוע - אם יש צורך
    if (this.clinicVisit.c > 0) {
      products.push({
        catalogNumber: 9,
        description: "ציוד",
        price: 30 ,
        quantity: this.clinicVisit.c
      });
    }

    const paymentData = {
      fullName: `${this.person.manName} ${this.person.womanName} ${this.person.familyName}`,
      email: this.person.manEmail || this.person.womanEmail,
      address: `${this.person.addres} ${this.person.city}`,
      products: products
    };

    this.paymentService.getIframeHtml(paymentData).subscribe(html => {
      console.log('HTML IFRAME התקבל:', html);

      // שליפת הכתובת מתוך התשובה (ה-html שהשרת מחזיר)
      const match = html.match(/url=([^&]+)/);
      if (match && match[1]) {
        const decodedUrl = decodeURIComponent(match[1]);

        // כאן השורה שלך:
        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(decodedUrl);
      }
    });}
  private extractUrl(response: string): string | null {
  const match = response.match(/url=(.*?)(?:&|$)/);
  if (match && match[1]) {
    const decodedUrl = decodeURIComponent(match[1]);
    return decodedUrl;
  }
  return null;
}

submitReceiptByCash() {
  const products: ProductDTO[] = [];

  products.push({
    catalogNumber: this.clinicVisit.treatmentsId,
    description: this.treatment.treatmentName,
    price: this.treatment.treatmentCost,
    quantity: 1
  });

  if (this.clinicVisit.c > 0) {
    products.push({
      catalogNumber: 9,
      description: "ציוד",
      price: 30,
      quantity: this.clinicVisit.c
    });
  }

  const paymentData = {
    fullName: `${this.person.manName} ${this.person.womanName} ${this.person.familyName}`,    
    email: this.person.manEmail || this.person.womanEmail,
    address: `${this.person.addres} ${this.person.city}`,
    products: products
  };
    console.log(paymentData.fullName);

this.paymentService.receiptForCash(paymentData).subscribe(response => {
  console.log('קארדקום החזיר:', response);

const result = JSON.parse(response);

const link = result.invoiceLink;
const status = result.status;
const error = result.errorMessage;

if (status === 0 || status === '0' && link) {
       this.paymentSuccess =true;
       window.open(link, '_blank');
} else 
  alert('שגיאה בהפקת קבלה: ' + error);



});}

addCheck() {
  if (this.checks.length < 4) {
    this.checks.push({
      checkNumber: '',
      bankNumber: '',
      branchNumber: '',
      accountNumber: '',
      dueDate: '',
      amount: 0,
    });
  }
}

// שליחת התשלום בצ'קים לשרת
submitCheckPayment() {
  const products: ProductDTO[] = [];

  products.push({
    catalogNumber: this.clinicVisit.treatmentsId,
    description: this.treatment.treatmentName,
    price: this.treatment.treatmentCost,
    quantity: 1
  });

  if (this.clinicVisit.c > 0) {
    products.push({
      catalogNumber: 9,
      description: "ציוד",
      price: 30,
      quantity: this.clinicVisit.c
    });
  }

  const payload = {
    fullName: `${this.person.manName} ${this.person.womanName} ${this.person.familyName}`,
    email: this.person.manEmail || this.person.womanEmail,
    address: `${this.person.addres} ${this.person.city}`,
    products,
    checks: this.checks.map(c => ({
      checkNumber: c.checkNumber,
      bankNumber: c.bankNumber,
      branchNumber: c.branchNumber,
      accountNumber: c.accountNumber,
      paymentDate: new Date(c.dueDate).toISOString(),
      sum: c.amount
    }))
  };

  this.paymentService.receiptForCheck(payload).subscribe(res => {
    console.log('קארדקום החזיר:', res);
    if (res.status === 0 && res.invoiceLink) {
      this.paymentSuccess =true;
      window.open(res.invoiceLink, '_blank');

    } else {
      alert('שגיאה בהפקת קבלה: ' + res.errorMessage);
    }
  });
}

formatDate(date: Date): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
}