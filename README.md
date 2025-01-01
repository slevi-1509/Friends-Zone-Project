Objective:

Create a client side with React to register and login for users.
Allow users to send friends requests, Open private messaging between them, upload posts and comments on posts.
Central messaging system that allow user to open chat rooms and invite other users to join using Socket.IO.
Create a Server side with Node.JS to handle MongoDB connection and Socket.IO for messaging.
All the data is saved in MongoDb.

Registration:

* User can register to the site with all the necessary information.
* During registration process the following are checked:
* Unique user name and email.
* There are 3 roles to choose: Admin, User and Programmer.
* Only one Admin role is allowed.
* Password should be confirmed.
* The password will be stored in the user record as crypted string by `bcrypt'.
* Upon registration user get 100 actions to perform daily on the site.
* User who already registered can move to Login Page.

Login:

* User need to provide a valid user name and password. (user name is unique).
* Password provided will be crypted and compared to the password in the user record to establish successful login.
* During Login process the user details will be stored in the MongoDB in database called "FullStack_Final_Project".
* Token:
* A token will be created and stored in a client cookie that will be created.
* The token will be valid for 2 hours.
* The token will be required for every API request to the server, without a valid token the user will be logged out of the system and will be redirect to the Login Page to login again to the system.
* Users who are not registered can move to Register Page.

Import users and posts:

* On the registration page user can import users details from users.json file locates in the src\data folder.
* On the posts page user can import posts details from posts.json file locates in the src\data folder.


Users Page functions:

* Shows a list of all the user's profiles or filter the list to see only friends
* Edit his own profile by modal.
* Open a chat messaging modal and create chat rooms.
* Replying to 'Friend Request' on the users cards:
* Accept: the 2 users will be updated as friends in their records.
* Reject: 'Friend Request' will be deleted from the records.
* Admin user can delete other user profiles.

User's detail modal:

* By clicking on user card a modal with more information will be open.
* You can send friend's request, reply to friend's request or open a private messaging modal.
* Admin can delete a user here.

Posts Page functions:

* User can upload posts, can use image URL for a picture attachment to the post.
* Can show all posts or user's posts:
* Both Lists sorted by all the fields in the post record (Date, Username, Title and body), in ascending or descending order.
* Both lists can be filtered by all the fields in the post record and an input search string for the Username, Title and body fields.
* When choosing new sorting and filtering parameters, click the REFRESH button to refresh the display with the new parameters.
* User can add a new post by modal to the database.
* User can delete only posts that he uploaded to the system.
* User can add comments to any post.
* Post will show last comment, you csn click on "Show more" to show all comments, and "Show less" to reduce to last comment again.


Daily actions limit:

* User get 100 actions upon registration.
* If all action will be used, user will be logged out and could login again only on the next day (after 00:00 local time), and then will be granted 10 new actions.
* If the user didn't use all the actions on the same day, the remaining actions will be added to the next day.
* Only less than 10 actions on the user counter will be added on the next day (more than 10 will be skipped).


Sessions and cookies:

* Upon login a session will be created and will be saved in the mongoose DB (automatically using 'connect-mongodb-session').
* The username, token, user ID, number of actions left and last action time will be saved in the user session.

Private messaging:

* 2 user can open private messaging between them.
* Post a new message requires a Body or an Image URL to be entered.
* if an Image URL is not valid, a "No Image" image will be shown.
* You can reply to any message by hovering on it and click the reply button that will appear next to the message:
    a copy of the message will be shown above the send message section, and the reply should be entered in the regular send message section.
* When closing the modal the private messaging will be disconnect until the next time you will open it with the same user.
* All messages is saved in the mongoDB.

Public Chat room system:

* On the main users page, a button "Chat" will open a modal to the Socket.io rooms.
* user can open chat room as much as he like and send messages in the same manner of the private messaging.
* Users who will join the chat rooms could send and reply to messages in those rooms.

