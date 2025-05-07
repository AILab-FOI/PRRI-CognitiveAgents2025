const TrustRanks = new Array
(
    { name: "Untrusted", min : -1, max: 1},
    { name: "Neutral", min : 2, max: 4},
    { name: "Trusted", min : 5, max: 7}
);

export default class Agent
{
    #TrustValue;
    #TrustRank;

    constructor()
    {
        let temp=TrustRanks[TrustRanks.length - 1].max - TrustRanks[0].min; 
        this.#TrustValue= TrustRanks[0].min + Math.round(temp/2); //uvijek srednja brojčana vrijednost i srednji trust rank
        this.#TrustRank=this.#EvaluateTrustRank();
    }

    getTrustRank() {return this.#TrustRank;}

    IncreaseTrust(step=1)
    {
        if(this.#TrustValue + step < TrustRanks[TrustRanks.length-1].max)
            this.#TrustValue+=step;
        else
            this.#TrustValue=TrustRanks[TrustRanks.length-1].max;
        this.#TrustRank=this.#EvaluateTrustRank();
    }

    DecreaseTrust(step=1)
    {
        if(this.#TrustValue - step > TrustRanks[0].min)
            this.#TrustValue-=step;
        else
            this.#TrustValue=TrustRanks[0].min;
        this.#TrustRank=this.#EvaluateTrustRank();
    }

    #EvaluateTrustRank()
    {
        for(let rank of TrustRanks)
        {
            if(this.#TrustValue >= rank.min && this.#TrustValue <= rank.max)
                return rank.name;
        }
        //uvijek je kod samo jednog elementa polja TrustRanks if uvjet istinit 
    }
}