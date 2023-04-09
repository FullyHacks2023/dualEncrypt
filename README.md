### add .env file inside app folder

These are fake details , change the secure key values , like : SESSION_SECRET , SECRET_KEY , SESSION_SECRET , etc

```
# HTTPS server port
SERVER_PORT=1337

#database details
DB_DIALECT= mariadb
DB_NAME= dual_encrypt
DB_USER=root
DB_PASS=pass

#session secret
SESSION_SECRET=bhgcbgyvgcGYVVG537ghvchgv&783gehuh!dcchgcgvcgh

#user password encryption
PASSWORD_ENCRYPTION=hchcHBG!78349784Ggvgyv!7433dhbusgdcwhhhjchj&hbdhwebw_bdhj1245
PASSWORD_ENCRYPTION_ROUND=5


#AES encryption
SECRET_KEY=85ecc6fb15f5589df773f11f4d2df3dc9729239da86534c2bb9f4b51ecbe954e
SECRET_IV=1e1fb31837babab6acca49e073fb470e
ECNRYPTION_METHOD=aes-256-cbc
```


### run docker compose to run DB
1. we put MaraiDB inside docker
2. run `docker-compose up -d`

### run the app
1. get into the app folder : `cd app`
2. run the app : `npm run dev`
