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
        motility_rank_1 :string;
        motility_rank_2 :string;
        motility_rank_3 :string;
        motility_rank_4 :string;
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
        motilityAfterTreatment_1 :string;
        motilityAfterTreatment_2 :string;
        motilityAfterTreatment_3 :string;
        motilityAfterTreatment_4 :string;
        gradeAfterTreatment :string;
        phAfterTreatment:string;
        totalMotileCount :string;
        emailForSendingResults :string;
        doctorTreatment:string;
        folliclesNumber:string;
    }