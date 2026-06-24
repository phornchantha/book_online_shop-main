const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const keyPath = path.join(__dirname, "serviceAccountKey.json");

if (!fs.existsSync(keyPath)) {
  console.error("\nMissing serviceAccountKey.json in the project root.");
  console.error(
    "1) Go to Firebase Console -> Project Settings -> Service accounts.",
  );
  console.error(
    "2) Generate a new private key and save it as serviceAccountKey.json in this folder.",
  );
  console.error("3) Install dependencies: npm install firebase-admin");
  console.error("Then run: node createAdmin.js\n");
  process.exit(1);
}

const serviceAccount = require(keyPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

(async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@bookshop.test";
  const password = process.env.ADMIN_PASSWORD || "Admin123!";

  try {
    let user;
    try {
      user = await admin.auth().getUserByEmail(email);
      console.log("Found existing user:", user.uid);
    } catch (err) {
      if (err.code && err.code === "auth/user-not-found") {
        user = await admin.auth().createUser({ email, password });
        console.log("Created new auth user:", user.uid);
      } else {
        throw err;
      }
    }

    const uid = user.uid;
    await firestore.doc(`users/${uid}`).set(
      {
        uid,
        name: "Admin",
        email,
        role: "admin",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    console.log("Set Firestore users/%s role=admin", uid);
    console.log("\nDone. You can now sign in with:", email);
  } catch (err) {
    console.error("Error creating admin user:", err);
    process.exit(1);
  }
})();
