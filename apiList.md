# DevTinder APIS


### authRouter
POST/SIGNUP
POST/LOGIN
POST/LOGOUT

### profileRouter

GET/profile/view
PATCH/profile/edit
PATCH/profile/password

### connectionRequestRouter

POST/request/sent/intereted/:userId
POST/request/sent/ignored/:userId
POST/request/review/accepted/:userId
POST/request/review/rejected/:userId


### userRouter

GET/user/connections
GET/user/request
GET/user/feed-Gets you the profile of other users on platform


status: ignore,interested,accepeted,rejected
