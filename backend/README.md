**This is the backend for the E-voting web application**

**The routes below can be used Either on http://localhost:3000 or https://sdg-team-40.herokuapp.com when using offline and online respectively**

## Available Routes
- /users
    - Request Method: *GET*
    - URL: *https://sdg-team-40.herokuapp.com/users*
    - This route shows all registered users which is being gotten from the PostgreSQL database.

- /register
    - Request Method: *POST*
    - URL: *https://sdg-team-40.herokuapp.com/register*
    - Required Inputs: *firstname*, *lastname*, *email*, *password*, *gender*, *phone_number*, *state_of_origin*, *local_govt*, *vin*
    - This route allows users to register their accounts with a unique email address.

- /login
    - Request Method: *POST*
    - URL: *https://sdg-team-40.herokuapp.com/login*
    - Required Inputs: *email*, *password*
    - This route allows users to login to their accounts with their email address and password. Also this will generate a special token for the user to use in passing Authorization and Authentication to access the other routes below.

- /profile
    - Request Method: *GET*
    - URL: *https://sdg-team-40.herokuapp.com/profile*
    - This route previews the currently logged in user's details after passing Authorization and Authentication.

- /profile/:id
    - Request Method: *PATCH*
    - URL: *https://sdg-team-40.herokuapp.com/profile/3*
        - 3 here could be any number/userID but the user only has the right to edit his/her own profile, for the user to know his/her own userID visit the route just above the one to preview the currently logged in user's details.
        - So far, the user only has the right to edit firstname, lastname & phone_number.
    - Required Inputs: *firstname*, *lastname*, *phone_number*
    - This route edits the currently logged in user's details after passing Authorization and Authentication.

- /contestant
    - Request Method: *GET*
    - URL: *https://sdg-team-40.herokuapp.com/contestant*
    - This route shows all registered users who has been added by the admin as a contestant, after passing Authorization and Authentication.

- /contestant
    - Request Method: *POST*
    - URL: *https://sdg-team-40.herokuapp.com/contestant*
    - Required Inputs: *email*, *party*, *admin*
    - This route allows any logged in user that has the special key to pass as an admin, to be able to add other users as contestant.
        - The special value that gives any user the previllage to add contestants is ***secured***
        - **NOTE:** This is an open project and that's why admin pass is open too for test purpose.

- /people/votes/local
    - Request Method: *GET*
    - URL: *https://sdg-team-40.herokuapp.com/people/votes/local*
    - This route shows the total number of users who has voted for the local Govt. election, after passing Authorization and Authentication.
        - **NOTE:** Users are only allowed to vote ones.

- /people/votes/state
    - Request Method: *GET*
    - URL: *https://sdg-team-40.herokuapp.com/people/votes/state*
    - This route shows the total number of users who has voted for the governorship election, after passing Authorization and Authentication.
        - **NOTE:** Users are only allowed to vote ones.

- /people/votes/country
    - Request Method: *GET*
    - URL: *https://sdg-team-40.herokuapp.com/people/votes/country*
    - This route shows the total number of users who has voted for the presidential election, after passing Authorization and Authentication.
        - **NOTE:** Users are only allowed to vote ones.

- /vote/local
    - Request Method: *GET*
    - URL: *https://sdg-team-40.herokuapp.com/vote/local*
    - This route checks if the currently logged in user has voted for his/her preferred local Govt. political party also shows what political party he/she has voted for if the user has voted, after passing Authorization and Authentication.

- /vote/state
    - Request Method: *GET*
    - URL: *https://sdg-team-40.herokuapp.com/vote/state*
    - This route checks if the currently logged in user has voted for his/her preferred governor's political party also shows what political party he/she has voted for if the user has voted, after passing Authorization and Authentication.

- /vote/country
    - Request Method: *GET*
    - URL: *https://sdg-team-40.herokuapp.com/vote/country*
    - This route checks if the currently logged in user has voted for his/her preferred president's political party also shows what political party he/she has voted for if the user has voted, after passing Authorization and Authentication.

- /vote/local
    - Request Method: *POST*
    - URL: *https://sdg-team-40.herokuapp.com/vote/local*
    - Required Inputs: *email*, *voter_party*
    - This route allows the currently logged in user to vote for his/her preferred local Govt. political party, after passing Authorization and Authentication.

- /vote/state
    - Request Method: *POST*
    - URL: *https://sdg-team-40.herokuapp.com/vote/state*
    - Required Inputs: *email*, *voter_party*
    - This route allows the currently logged in user to vote for his/her preferred Governor's political party, after passing Authorization and Authentication.

- /vote/country
    - Request Method: *POST*
    - URL: *https://sdg-team-40.herokuapp.com/vote/country*
    - Required Inputs: *email*, *voter_party*
    - This route allows the currently logged in user to vote for his/her preferred president's political party, after passing Authorization and Authentication.

**Thank You**