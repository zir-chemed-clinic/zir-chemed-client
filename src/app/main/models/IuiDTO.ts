export class IuiDTO
    {
        iuiid :number;
        clinicVisitsId?:number; 
        fresh?:boolean;
        condom?:boolean;
        ejac ?:boolean;
        cup ?:boolean;
        other :string;
        givingTime ?:Date ;
        givingTimeString :string;
        volumeCc :string;
        appearance:string;
        conc105cc:string;
        motility :string;
        grade :string;
        ph:string;
        comments :string;
        wimUp ?:boolean;
        gradient ?:boolean;
        wash ?:boolean;
        otherTreatment ?:boolean;
        commentsTreatment :string;
        volumeCcAfterTreatment :string;
        conc105ccAfterTreatment:string;
        motilityAfterTreatment :string;
        gradeAfterTreatment :string;
        phAfterTreatment:string;
        totalMotileCount :string;
        emailForSendingResults :string;
        doctorTreatment:string;
        folliclesNumber:string;
    }