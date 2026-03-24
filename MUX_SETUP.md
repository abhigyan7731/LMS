# Mux Video API – Setup Roadmap

Use this guide to fix the **POST /api/mux/upload 500** error and enable video lecture uploads.

---

## 1. Create a Mux account

1. Go to **[mux.com](https://mux.com)** and sign up (or sign in).
2. Confirm your email if required.

---

## 2. Get your API credentials (Token ID + Secret)

1. Open **Access Tokens**:  
   **https://dashboard.mux.com/settings/access-tokens**
2. Click **Generate new token**.
3. Set:
   - **Name**: e.g. `LMS Video Uploads`
   - **Permissions**: **Read and write** (or at least Video: read + write).
   - **Environment**: **Development** for local/dev; **Production** for live.
4. Click **Generate token**.
5. **Copy both values immediately** (the secret is shown only once):
   - **Token ID** → use as `MUX_TOKEN_ID`
   - **Secret Key** → use as `MUX_TOKEN_SECRET`

If you lose the secret, you must create a new token; Mux does not show it again.

---

## 3. Add credentials to your app

1. In your project root, open **`.env.local`** (create it if it doesn’t exist; never commit this file).
2. Add or update:

```env
# Mux (Video Hosting) – required for lecture uploads
MUX_TOKEN_ID=your_token_id_here
MUX_TOKEN_SECRET=your_secret_key_here
```

3. Optional (for signed playback or Mux player features later):

```env
NEXT_PUBLIC_MUX_DATA_ID=your_mux_data_id_here
```

- `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` are **required** for **upload** and **complete** APIs.
- `NEXT_PUBLIC_MUX_DATA_ID` is for player/analytics; uploads work without it.

4. Save the file and **restart the dev server** (`npm run dev`) so env vars are loaded.

---

## 4. Confirm the upload flow in your app

Your app already does the following; you only need valid env vars and a valid chapter.

| Step | What happens |
|------|-------------------------------|
| 1 | Teacher selects a lecture (chapter) and drops a video in the upload area. |
| 2 | Frontend calls **POST /api/mux/upload** with `{ chapter_id }`. |
| 3 | Backend uses `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` to create a Mux direct upload. |
| 4 | Frontend uploads the file to the returned `uploadUrl` (PUT). |
| 5 | Frontend calls **POST /api/mux/complete** with `{ upload_id, chapter_id }`. |
| 6 | Backend gets the asset/playback ID from Mux and saves `mux_playback_id` on the chapter. |
| 7 | Student sees the video in the learn view using that playback ID. |

---

## 5. If you still get 500 on `/api/mux/upload`

1. **Check env**
   - Ensure `.env.local` has `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` (no typos, no quotes unless the value contains spaces).
   - Restart the Next.js dev server after changing `.env.local`.

2. **Check the response**
   - With the improved error handling, the API may return `400` with a message like `Mux credentials missing` or the actual Mux error message. Check the **Network** tab (e.g. response body) for the exact text.

3. **Check auth and chapter**
   - User must be signed in (Clerk).
   - User must be the **teacher** of the course that owns the chapter.
   - `chapter_id` must be a valid chapter UUID that belongs to a course owned by that teacher.

4. **Mux dashboard**
   - In **https://dashboard.mux.com/video**, check **Assets** or **Uploads** for errors or failed uploads.

---

## 6. Quick checklist

- [ ] Mux account created
- [ ] New access token created at https://dashboard.mux.com/settings/access-tokens (Read + Write)
- [ ] Token ID and Secret copied into `.env.local` as `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET`
- [ ] Dev server restarted after editing `.env.local`
- [ ] Upload tried again as the **teacher** who owns the course, on a real chapter

After this, **POST /api/mux/upload** should return **200** with `{ uploadId, uploadUrl }` instead of 500.
