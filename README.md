# @module/authentication

## provider
that module provider `SignUpResponse`, `SignUpRequest` presentation
and `Accounts` domain too.

## actions

### SignUp

required:
-  `email`, `username` and `password`

validation:

`username` and `email` is unique
`password` min length 8 max length 15

processor:

the `password` is `encrypted` before save on database

returned:
a JWT token to provider for client, with expiration time defined on config

config:
for configure a lib is need provider HOST and PORT to database and redis like exemple:
```typescript
import { auth } from '@module/authentication'

auth.config({
  redis:{
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  JWT: {
    secret: process.env.JWT_SECRET,
    expiration_time: process.env.JWT_EXPIRATION_TIME
  }
})

```