# Push Code Using GitHub Token - Quick Guide

## Step 1: Create Token (2 minutes)

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "FSADPROJECT"
4. Check: ☑️ `repo` (full access)
5. Click "Generate token"
6. **COPY TOKEN NOW** (looks like: `ghp_xxxxxxxxxxxx...`)

## Step 2: Create GitHub Repository (1 minute)

1. Go to: https://github.com/new
2. Name: `FSADPROJECT`
3. **DON'T** check "Add README"
4. Click "Create repository"
5. Copy the URL shown

## Step 3: Push Your Code (30 seconds)

### Easy Method: Just run these 2 commands

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/FSADPROJECT.git

# Push (it will ask for credentials)
git push -u origin main
```

When prompted:
- **Username:** Your GitHub username
- **Password:** Paste your token (NOT your GitHub password!)

### Alternative: Token in URL (one command)

```bash
# Replace YOUR_TOKEN and YOUR_USERNAME
git remote add origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/FSADPROJECT.git
git push -u origin main
```

## Done! ✅

Visit `https://github.com/YOUR_USERNAME/FSADPROJECT` to see your code!

---

## Troubleshooting

**"Remote already exists"?**
```bash
git remote remove origin
# Then try again
```

**Authentication failed?**
- Use TOKEN as password, not your GitHub password
- Make sure token has `repo` permission
- Check token is not expired
