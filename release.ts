// Push our built firebase app to production because we are awesome like that.
const {GoogleAuth} = require('google-auth-library');
require('process');
const child_process = require('child_process');

async function serviceAccountLogin() {
  console.log(`Authenticating as service account using ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/firebase']
  });
  const token = await auth.getAccessToken();
  console.log(`Authentication succeeded.`);
  process.env.FIREBASE_TOKEN = token;
}

async function main() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS === undefined) {
    console.log(`Using your firebase login credentials.`);
  } else {
    await serviceAccountLogin();
  }
  const out = child_process.execFileSync('firebase', ['deploy',
    '--only', 'hosting', '--project', 'corona-compare']);
  console.log(out.toString());
}

main().catch(console.error);
