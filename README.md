# Semester 3 | Data Structures & Algorithms

## Sprint 1: Secret Message Database
 
This is a group project for Sprint #1 (3nd Semester) at Keyin College's Software Development Program.  

This project uses **Node, Express, and PostgreSQL (with pgAdmin)** to create a web form that allows 'secret agents' to enter messages into a database, and retrieve messages using either a stack or queue.

Please note that when a new record is added to a certain data structure, it cannot be retrieved using a different one, as they represent different levels of urgency. The stack data structure (1) is used for urgent messages, and the queue data structure (2) is used for non-critical messages.

---

**The messages database will be empty when you first run the app. You will need to add records to the messages table in order to test the app - This way, you can test the stack and queue functions with your own data. If there is no data to retrieve for a specified data structure, an error message will be returned to the user.**

---

### Setup

1. First, the database needs to be restored locally. In pgAdmin, create a new database and restore it using the file ```Sprint1_Data-Structures_DB_Backup.sql```

	Before you start the program, please note that you must first alter ```config.js``` to use your credentials. It is currently using the 'default' credentials used for PostgreSQL/pgAdmin from our Database Programming and Processing class, so you'll most likely have to update the user and password properties.

   In ```config.js```, replace these user and password properties with your PostgreSQL credentials between the double quotes, and save the file.
   
   (**NOTE:** Do not include <>, they are just are placeholder markers.)

   ```
   const pool = new Pool({
	   user: "<YOUR USERNAME>",
	   host: "localhost",
	   database: "data-structures-sprint1",
	   password: "<YOUR PASSWORD>",
	   port: 5432,
   });
   ```
   
2. To navigate to the main project folder, open the terminal and enter the command:

   ```
   cd sprint
   ```
   
3. Next, install dependencies. Enter the command:
 
   ```
   npm install
   ```
 
4. Next, to run the program and start the server, enter the command:

   ```
   node app
   ```
   
5. To view the web form, visit the local server in your browser with the URL:

   ```
   http://localhost:3000/
   ```
   
6. To stop the server, navigate to your terminal and press ```CTRL + C```.



## Contributers

<table>
  <tr>
    <th>Author</th>
    <th>GitHub</th>
  </tr>
  <tr>
    <td>Makenzie Roberts</td>
    <td>
      <a href="https://github.com/MakenzieRoberts"><img height="50px" src="https://avatars.githubusercontent.com/u/100213075?v=4"></a>
    </td>
  </tr> 
  <tr>
    <td>Kara Balsom</td>
    <td>
      <a href="https://github.com/kbalsom"><img height="50px" src="https://avatars.githubusercontent.com/u/100210446?v=4"></a>
    </td>
  </tr>
  <tr>
    <td>David Turner</td>
    <td>
      <a href="https://github.com/DeToxFox"><img height="50px" src="https://avatars.githubusercontent.com/u/95373983?v=4"></a>
    </td>
  </tr>
    <tr>
    <td>Glen May</td>
    <td>
      <a href="https://github.com/ellis0n"><img height="50px" src="https://avatars.githubusercontent.com/u/100211236?v=4"></a>
    </td>
  </tr>
</table>
