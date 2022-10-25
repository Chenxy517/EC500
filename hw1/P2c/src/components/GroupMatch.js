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


    remove(element, array)
    {
        // Remove specific element from an array:
        for(let i = 0; i < array.length; i++){ 
            if (array[i] === element) { 
                array.splice(i, 1); 
            }
        }
        return array;
    }

    get match_group()
    {   
        // User has not been assigned for a specific group.
        var unmatched = [...Array(this.table.length).keys()];
        // Given a random USER, and pair the group members for this USER
        var user = Math.floor(Math.random() * this.table.length);

        var initial = true;

        do 
        {   // Define A Group for this USER:
            var user_group = new Array();

            if (initial) // Initialize, select the group for a random User:
            {   
                user_group.push(user);
                unmatched = this.remove(user, unmatched);
                this.get_member(user, user_group, unmatched);
                initial = false;
            }
            else // Select the group for the residual USER only, which is grouped by nobody else.
            {   
                user = unmatched[0];
                user_group.push(user);
                unmatched = this.remove(user, unmatched);
                this.get_member(user, user_group, unmatched);
            }
                
        }
        // If there is still USER not matched with any group, or he is the only one GUY that has been not selected by anybody else.
        while(unmatched.length > 1)
       
        return this.#_groupOfMatch;
    }


    get_member(current_user, current_user_group, unmatched_user)
    {   
        // Keep looking for teammates for the current user, until reach the maximum size of the group.
        while (current_user_group.length < this.group_number) {
            // The best approached User(index) of the current user', given by the local MAXIMUM score of the user provided.
            var best_user = this.table[current_user].indexOf(Math.max(...this.table[current_user]), 0);
            current_user_group.push(best_user);
            unmatched_user = this.remove(best_user, unmatched_user);
            
            // For simple match a group member only by using Greedy, no tricky.
            current_user = best_user;
        }

        this.#_groupOfMatch.push(current_user_group);
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