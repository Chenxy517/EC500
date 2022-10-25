/**
 * A generalization of {@link MD5} to any of the standard Group Matching method.
 * This class represents a MD5(input) base class, that will encrypt the content by the MD5 message-digest algorithm.
 * For example, MD5("your_content") should be equivalent to the MD5 class, and it is the only way to initialize it.
 * 
 * Note!!: Need install npm package, using "npm install md5" 
 * @param parameter The input of the content who needs to be encrypted.
 * @var _encrypt(#) The private unencrptied content that is only accessible by inside of the class.
 */


// For Test algorithm only: 
const data = [
    [0 , 50, 50, 0 , 0 ],
    [50, 0 , 0 , 25, 25],
    [50, 25, 0 , 5 , 20],
    [25, 25, 25, 0 , 25],
    [0 , 0 , 0 , 100,0 ],
];
const group_size = 3;

class GroupMatch{

    // Privates should start with #. They are only accessible from inside the class.
    #_groupOfMatch = [[]];
    #_totalScore = 0;
    #_best_match = [[]];
 
    // Initialize the constructor, include setter:
    constructor(score_table, group_num)
    {   
        // Define public variables that could be accessed by each member function: 
        this.table = score_table;
        this.group_number = group_num;
        try {
            if (!score_table)
            {
                throw "Table is empty";
            }
            if (group_num < 2){
                throw "Group size cannot smaller than 2";
            }
            if (group_num >= score_table.length){
                throw "Invalid Group size, Please try again.";
            }
            
        }
        catch(err) {
            // DEBUG:
            throw new Error(err);
            // window.Error(err);
        }


    }


    get match_group()
    {
        for(var i=0; i < this.table.length; i++){
            
        }
        return this.#_groupOfMatch;
    }

    get total_score()
    {
        return this.#_totalScore;
    }

    get best_match()
    {

        return this.#_best_match;
    }
}


const group = new GroupMatch(data, 4);
console.log("One of the Solution: " + group.match_group);
const best_match = group.best_match;
console.log("Best Match: " + best_match + ", Score is: " + group.total_score);


// export default GroupMatch;