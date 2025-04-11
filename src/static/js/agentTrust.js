const TrustRanks = new Array
(
    { name: "Untrusted", min : -1, max: 1},
    { name: "Neutral", min : 2, max: 4},
    { name: "Trusted", min : 5, max: 7}
);

class Agent
{
    #TrustValue;
    #TrustRank;

    constructor()
    {
        let middle = Math.trunc(TrustRanks.length / 2);
        this.#TrustValue=TrustRanks[middle].min + (TrustRanks[middle].max - TrustRanks[middle].min) / 2;  //sredina Neutral ranka 
        this.#TrustRank=this.#EvaluateTrustRank();
    }

    getTrustRank() {return this.#TrustRank}

    IncreaseTrust()
    {
        if(this.#TrustValue < TrustRanks[TrustRanks.length-1].max)
        {
            this.#TrustValue++;
            this.#TrustRank=this.#EvaluateTrustRank();
        }
    }

    DecreaseTrust()
    {
        if(this.#TrustValue > TrustRanks[0].min)
        {
            this.#TrustValue--;
            this.#TrustRank=this.#EvaluateTrustRank();
        }
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
