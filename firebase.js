const admin = require("firebase-admin");
// const serviceAccount = require("./secret.json");

require("dotenv").config();

const stringifiedKey = JSON.stringify(process.env.FIREBASE_ADMIN_PRIVATE_KEY);
// console.log(stringifiedKey.replace(/\\n/g, "\n"));

const app = admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount),
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
    private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    private_key: stringifiedKey.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_ADMIN_client_x509_cert_url,
    universe_domain: "googleapis.com",
  }),
});

// const app = initializeApp({
//   credential: admin.credential.cert({
//     private_key:
//       process.env.FIREBASE_ADMIN_PRIVATE_KEY[0] === "-"
//         ? process.env.FIREBASE_ADMIN_PRIVATE_KEY
//         : JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY),
//     client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
//     project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
//   }),
//   //   databaseURL: process.env.FIREBASE_DATABASE_URL,
// });
// const app = admin.initializeApp({
//   credential: admin.credential.cert({
//     private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),

//     client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
//     project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
//   }),
//   //   databaseURL: process.env.FIREBASE_DATABASE_URL,
// });

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(req.headers.authorization);
  if (authHeader) {
    const idToken = authHeader.split(" ")[1];
    app
      .auth()
      .verifyIdToken(idToken)
      .then(function (decodedToken) {
        return next();
      })
      .catch(function (error) {
        console.log(error);
        return res.sendStatus(403);
      });
  } else {
    console.log("no auth header");
    res.sendStatus(401);
  }
};

module.exports = { authenticateJWT };
