# SnowHub

Welcome to our project!

# Running Environment

Run two scripts at the same time using *concurrently* with the following command:

```
npm run dev
````

# Resource authorization

In order to get an authorization token:

POST at http://<server_route>:<server_port>/users/login

Payload:
{
    "email": "test2@email.com",
    "password": "12348"
}

Response example:

{
    "message": "Auth successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QyQGVtYWlsLmNvbSIsInVzZXJJZCI6IjVmZDBlYmM3OTkwMDkxMTQ5YzFmYmQ2ZiIsImlhdCI6MTYwNzU0Mzk3NCwiZXhwIjoxNjA3NTQ3NTc0fQ.4fW7biPyFF3nbVLXN53vuDiCFTO7PP1OjelTXR_xOwg"
}

Then, you can use this token to authorize protected resources.


DEV notes:
    - analyze the case on users endpoint when bcrypt fails, returns an error and not a hash
    - admin and normal users have a permanent token. (it doesn’t expire)
    
DEV notes (security):
Store the mongo atlas and jwt secret in environment variables before going live and then use dotenv to parse them