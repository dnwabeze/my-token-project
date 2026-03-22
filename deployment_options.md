# Free Hosting Options for Frontend

Since you want to share your project with friends for review while keeping the backend on your VPS, here are the best free options for the frontend:

## 1. Vercel (Recommended)
Vercel is extremely easy to use and you already have a `vercel.json` in your project.
- **How to deploy**:
  1. Push your code to a **GitHub** repository.
  2. Log in to [Vercel](https://vercel.com/) and click **"Add New" -> "Project"**.
  3. Import your GitHub repository.
  4. It will automatically detect the static files and deploy them.
  5. You will get a free `.vercel.app` URL for sharing.

## 2. GitHub Pages
If your code is on GitHub, this is a built-in option.
- **How to deploy**:
  1. Go to your repository **Settings**.
  2. Click on **Pages** in the sidebar.
  3. Under "Build and deployment", select the **Branch** (e.g., `main`) and folder (usually `/ (root)`).
  4. Your site will be live at `yourusername.github.io/your-repo-name`.

## 3. Surge.sh (Command Line)
If you don't want to use GitHub, Surge is a very fast CLI-based option.
- **How to deploy**:
  1. Run `npm install -g surge` (if you have Node.js installed locally).
  2. In your project folder, simply type `surge`.
  3. Follow the prompts to create an account and get a URL.

---

### Connecting to your VPS Backend
The frontend is already configured to talk to your VPS at `187.124.30.148`. 
Make sure your VPS firewall allows incoming traffic on port **3000**.
