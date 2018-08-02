import {Injectable} from '@angular/core';


@Injectable()
export class ReviewRating {

    public calculate(answers, questions, type)
    {
        switch(type){
            case 1:
                return this.calculateFlat(answers);
            case 2:
                return this.calculateByWeight(answers, questions);
            case 3:
                return this.calculateByPercentage(answers, questions)
        }
    }
    protected calculateFlat(answers)
    {
        var answers:any = Object.values(answers).filter((a:any)=>{
            return a.answer !== 0;
        });
        var total = answers.reduce(function(v, u){
            return v + u.answer;
        }, 0);
        var avg = this.roundOff(total/answers.length);
        return avg || 'N/A';
    }
    protected calculateByWeight(answers, questions)
    {
        var rate = Object.values(answers).filter((a:any)=>{
            return a.answer !== 0;
        }).map((a:any)=>{
            var weight = questions[a.question_id].weight;
            return [a.answer * weight, weight];
        }).reduce((u, v)=>{
            return [u[0] + v[0],  u[1] + v[1]];
        }, [0, 0]);
        return this.roundOff(rate[0]/rate[1]) || 'N/A';
    }
    protected calculateByPercentage(answers:any, questions)
    {
        answers = Object.values(answers);
        var excludedPercentage = answers.filter((a)=>{
            return a.answer == 0;
        }).map((a)=>{
            return questions[a.question_id].weight;
        }).reduce((x, z)=>{
            return x + z;
        }, 0);
        var netPercentage = 100 - excludedPercentage;
        var result = answers.filter((a)=> {
            return a.answer !== 0;
        }).map((a)=> {
            var weight = ((questions[a.question_id].weight) / (netPercentage/100));
            return (a.answer / 5) * weight;
        }).reduce((u, v)=> {
            return u + v;
        }, 0);
        result = (result * 5)/100;
        return this.roundOff(result) || 'N/A';
    }
    public roundOff(val)
    {
        return (Math.round((val) * 10) / 10);
    }
}
