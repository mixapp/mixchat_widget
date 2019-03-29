### Mixchat

Widget for Mixchat

### How to install

1. Download repo from github
2. Run `npm install` or `yarn` command
3. Run `npm start` or `yarn start` command
4. In build dir you can find widget.js and widget.map

Also [Demo](https://mixchat.mixapp.io)

### Tomake a docker image

1. Download repo
2. Run `docker build . -t widget`
3. Run `docker run -p 3000:80 widget`
4. Look at http://localhost:8080

## To use your companyId

In the root folder find dir "public" and in the index.html change companyid.

Powered by Mixapp. See: https://mixapp.io/mixchat
