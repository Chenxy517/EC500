class GroupMatch{

    // Privates should start with #. They are only accessible from inside the class.
    #_groupOfMatch = [[]];
    #_totalScore = 0;
    #_best_match = [];
 
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
            if (group_num > score_table.length){
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
        // User has not been assigned for a specific group.
        // Initialized as all members are not matched.
        var unmatched = [...Array(this.table.length).keys()];
        do
        {
            unmatched = this.make_group(this.table, unmatched);
        }
        while(unmatched.length > this.group_number);

        // Else: 
        // the numbers of the residual member in the unmatched, 
        // which is lesser than the group_size, We force make them a team.

        this.#_best_match.push(unmatched);

        return this.#_best_match;
    }

    /**
     * Using Greedy Algorithm to choose the best group of under the current combination.
     * The function will store the temporary result into the record of global combination,
     * and @returns: the residual members which has not matched.
     * @param current_table: 
     * @param unmatched_member: 
     */
    make_group(current_table, unmatched_member)
    {
      
        var all_group = chooseMember(unmatched_member, this.group_number);

        // Intitailize, Go through and Select the group which has the maximum SUM (Best score)
        var group_score = -1;

        var best_group = [];
        for (var i=0; i < all_group.length; i++)
        {   
            var current_score = this.get_score(all_group[i], current_table)
            if( group_score < current_score)
            {
                group_score = current_score;
                // Update the current score
                best_group = all_group[i];
            }

        }
        // Push the current best matched group into the global combination for showing later.
        this.#_best_match.push(best_group);
        // 
        for (var j=0; j < best_group.length; j++)
        {
            unmatched_member = this.remove(best_group[j], unmatched_member);
        }

        return unmatched_member;
    }
    
    // Given a group includes some members, find the total_rank(score) of this group
    get_score(group, datasheet)
    {   
        var _total_score = 0;
        for (let i=0; i < group.length; i++)
        {   
            var member_score = 0;
            var this_member = group[i];
            for (let j=0; j < group.length; j++)
            {   
                if (group[j] != this_member)
                {   
                    var score = datasheet[group[i]]['git' + group[j]];
                    member_score = score + member_score;
                }
            }
            _total_score = member_score + _total_score;
            
        }
        return _total_score;
    }
}

// Find All basic combination based on specific group_size
function chooseMember(arr, member_num) {
    var allResult = [];

    (function recursion(arr, member_num, result) {
        var arrLen = arr.length;
        if (member_num > arrLen) {
            return;
        }
        if (member_num === arrLen) {
            allResult.push([].concat(result, arr))
        } else {
            for (var i = 0; i < arrLen; i++) {
                var newResult = [].concat(result);
                newResult.push(arr[i]);

                if (member_num === 1) {
                    allResult.push(newResult);
                } else {
                    var newArr = [].concat(arr);
                    newArr.splice(0, i + 1);
                    recursion(newArr, member_num - 1, newResult);
                }
            }
        }
    })(arr, member_num, []);

    return allResult;
}

export default GroupMatch;