# Publishing the app on Google Play

Two versions of the app are built from the same code:

| | GitHub APK (what you have now) | Google Play |
|---|---|---|
| Updates | Downloads and installs itself (pop-up + "Update available" notification) | Google Play updates it |
| Self-update permissions | Yes | Removed (Play does not allow apps to update themselves) |
| How it's built | Every push to `mobile_app/` | Actions → **Run workflow** with "Also build the Google Play bundle" ticked |

Both use the same version numbers (1.0.N).

---

## 1. One-time: put the signing key in GitHub Secrets

The signing key (`mobile_app/android/app/upload-keystore.jks`) is no longer stored in the
repository. GitHub Actions now reads it from secrets. **Every APK must be signed with this same
key, or installed apps can't update** — keep a backup of the file somewhere safe (not in git).

1. Copy the key as text (PowerShell, in the project folder):
   ```powershell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("mobile_app\android\app\upload-keystore.jks")) | Set-Clipboard
   ```
2. GitHub → repository **Settings → Secrets and variables → Actions → New repository secret**, and add:

   | Name | Value |
   |---|---|
   | `ANDROID_KEYSTORE_BASE64` | paste (from step 1) |
   | `ANDROID_KEYSTORE_PASSWORD` | the keystore password |
   | `ANDROID_KEY_ALIAS` | the key alias (`upload`) |
   | `ANDROID_KEY_PASSWORD` | the key password |

3. **Actions → Build Android APK → Run workflow.** The build checks that the key is the original
   one (its fingerprint must be `E7:3D:1A:49:…:22:C2`) before it signs anything.

> The old key and password were in the public git history. Removing the file now doesn't undo
> that, so treat this key as known. It's fine as the **upload** key for Play (Play still needs
> your Google account to publish), and you can ask Google to reset an upload key later.

## 2. Build the Play bundle

GitHub → **Actions → Build Android APK → Run workflow** → tick **"Also build the Google Play
bundle (.aab)"** → Run. When it finishes, open the run and download
**google-play-bundle-v1.0.N** under *Artifacts* (a zip with `sachin-dev-v1.0.N.aab`).

## 3. Play Console (one time)

1. [Google Play Console](https://play.google.com/console) → **Create app**: name **Sachin Dev**,
   App, Free, accept the declarations.
2. **App signing:** keep **"Let Google manage and protect your app signing key"** (recommended).
   Your `upload-keystore.jks` becomes the *upload key*.
   - Note: the Play version is then signed by Google, so someone with the GitHub APK can't
     switch to the Play version without uninstalling once. Both keep updating on their own.
3. **Testing → Internal testing → Create release** → upload the `.aab` → add yourself as a tester.
4. **New personal developer accounts must run a closed test with at least 12 testers for 14 days
   before they can publish to everyone.** Start the closed test early.
5. Fill in **App content** (answers below), the **Store listing** (text below) and the graphics.

**Later releases:** add the secret `PLAY_SERVICE_ACCOUNT_JSON` (a Google Cloud service account with
access in Play Console → *Users and permissions*) and every "Run workflow" with the box ticked sends
the bundle straight to internal testing as a draft. Without it, upload the `.aab` by hand.

## 4. Store listing (copy and paste)

**App name** (30 max): `Sachin Dev`

**Short description** (80 max):
```
Websites, web apps & mobile apps by freelance developer Sachin Rathod.
```

**Full description:**
```
Sachin Dev is the portfolio app of Sachin Rathod, a freelance fullstack developer from Mumbai who builds websites, web apps and mobile apps — from the database to the interface.

What you can do in the app:
• Browse real client projects, with screenshots and the tech behind each one
• See the services: business websites, online stores, dashboards and admin panels, and Android apps
• Read the blog — practical notes on building for the web and mobile
• Ask the AI assistant about skills, projects or how a project would work
• Get in touch your way — WhatsApp, email, a phone call or the contact form

Need something built? Tell me what you need, see how a project works, and send a message straight from the app. I usually reply within a day.

Built with Flutter, with a Node.js and MySQL backend shared with the website, so everything stays in sync.
```

**Category:** Business · **Contact email:** rathodsachin0766@gmail.com ·
**Website:** your portfolio URL · **Privacy policy:** `https://<your-website>/privacy`
(the page is on the website now).

**Graphics needed:** app icon 512×512 PNG, feature graphic 1024×500, at least 2 phone screenshots.

## 5. App content answers

- **Privacy policy:** `https://<your-website>/privacy`
- **Ads:** No ads.
- **App access:** All functionality is available without special access (no login).
- **Content rating:** answer the questionnaire — no violence, sexual content, gambling or
  user-to-user sharing → rated for everyone. (The AI assistant only answers about the portfolio.)
- **Target audience:** 18 and over (not designed for children).
- **News app:** No. **Government app:** No. **Financial features:** None. **Health:** None.
- **Data safety:**
  - *Collected:* Personal info → **Name**, **Email address**, **Phone number** (optional);
    Messages → **Other in-app messages** (contact form, project brief, AI assistant questions).
  - *Purpose:* App functionality, Developer communications. *Optional* for the user (only when
    they send a message). Not used for ads or analytics. AI assistant questions are processed by
    a service provider to answer and are not stored.
  - *Shared with third parties:* No (hosting and AI providers act for you, which Play doesn't
    count as sharing).
  - *Encrypted in transit:* Yes. *Users can ask for deletion:* Yes, by email.
