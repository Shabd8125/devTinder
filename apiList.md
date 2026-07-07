# DevTinder API 
# authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password     // forget password api

## connectionRequestRouter
- POST /request/send/:status/:userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRequest
- GET /user/requests/received
- GET /user/connections
- GET /user/feed - Get you the profile of other users on platform

Status - ignore , interested , accepted , rejected


