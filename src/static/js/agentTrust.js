const TrustRanks = new Array
(
    { name: "Untrusted", min : -2, max: 0},
    { name: "Trusted", min : 1, max: 3}
);

class Agent
{
    #TrustValue;
    #TrustRank;

    constructor(initialValue = null)
    {
        if(initialValue == null)
        {
            let temp=TrustRanks[TrustRanks.length - 1].max - TrustRanks[0].min; 
            initialValue = TrustRanks[0].min + Math.floor(temp/2);  //uvijek srednja brojčana vrijednost i srednji trust rank
        }
        else
        {
            if (!Number.isInteger(initialValue)) 
                initialValue = parseInt(initialValue);
            if(initialValue > TrustRanks[TrustRanks.length-1].max)
                initialValue= TrustRanks[TrustRanks.length-1].max;
            else if (initialValue < TrustRanks[0].min)
                initialValue = TrustRanks[0].min;
        }
        this.#TrustValue = initialValue;
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

    // KORISTI SAMO ZA SPREMANJE U SESSION STORAGE ILI DEBUG INFO, ZA GAME LOGIKU KORISTI METODE IZNAD
    exportForSessionStorage(){ return this.#TrustValue;} 
}