# Next.js + Sanity + Algolia

![Screenshot of the website generated by this template](https://cdn.sanity.io/images/hyd9q7fy/6776304977675a6136/31b6c30cb41ba71976abc61aa821893e013be1c5-2174x1082.png)
_the website this template generates_

![Algolia Search implemented on the front-end](https://cdn.sanity.io/images/hyd9q7fy/6776304977675a6136/9865b1a117a4c2f7c9a281329de3a4042693199c-1918x484.png)
_Algolia search implemented on the front-end_

![Screenshot of Sanity Studio using Presentation Tool to do Visual Editing](https://cdn.sanity.io/images/fkfgfb3d/production/8971f921877c85b21dc1fc0d84031ee1886bc99d-1488x890.png)
_Visual Editing using Sanity's Presentation Tool_

This starter is a statically generated website and blog built with [Next.js 15](https://nextjs.org/blog/next-15) (App Router) for the frontend and powered by [Sanity][sanity-homepage] for content management. It includes a standalone Sanity Studio, providing features like real-time collaboration, visual editing, and live updates through its [Presentation][presentation] mode.

The Studio integrates with Sanity's Content Lake, offering hosted content APIs with a flexible query language, on-demand image transformations, advanced patching, and more. These capabilities seamlessly connect to your frontend via Sanity’s [Live Content API](https://www.sanity.io/live), enabling live, dynamic updates without requiring page reloads. Whether you are launching a blog, building a website, or exploring new technologies, this starter gives you a solid foundation to get started.

## Features

- **Next.js 15, Fast and Performant:** Static site built with Next.js App Router for excellent speed and SEO.
- **Real-time Visual Editing:** Use Sanity's [Presentation](https://www.sanity.io/docs/presentation) tools to see live updates as you edit.
- **Live Content:** The [Live Content API](https://www.sanity.io/live) allows you to deliver live, dynamic experiences to your users without the complexity and scalability challenges that typically come with building real-time functionality.
- **Customizable Pages:** Create and manage pages using a page builder with dynamic components.
- **Powerful Content Management:** Collaborate with team members in real-time, with fine-grained revision history.
- **AI-powered Media Support:** Auto-generate alt text with [Sanity AI Assist](https://www.sanity.io/ai-assist).
- **On-demand Publishing:** No waiting for rebuilds—new content is live instantly with Incremental Static Revalidation.
- **Easy Media Management:** [Integrated Unsplash support](https://www.sanity.io/plugins/sanity-plugin-asset-source-unsplash) for seamless media handling.

## Demo

🌐 [https://template-nextjs-clean.sanity.dev](https://template-nextjs-clean.sanity.dev/)

## Get Started Quickly

The easiest way to start is by deploying your app to **Vercel** with the button below. This will:

- Clone the repo to your GitHub account.
- Link or set up a Sanity project.
- Deploy your Next.js app on Vercel.

### 🚀 1\. **Deploy to Vercel**

[![Deploy with Vercel](https://vercel.com/button)][vercel-deploy]

Click the button to begin the setup wizard for your Next.js and Sanity project.

> **Note:** Prefer manual installation? See [manual-installation.md](manual-installation.md).

After your Vercel build completes, you'll see a toast error "Couldn't connect to Live Content API". To fix this, you'll need to set the URL of your app (Ex: https://nextjs-sanity-app.vercel.app) as a CORS origin in your Sanity [**Manage Console**](https://www.sanity.io/manage), located under **API** > **CORS Origins**. You don't need to allow credentials.

To account for development and preview deployments, you might also want to add CORS Origin with a wildcard `*`, like `https://nextjs-sanity-app-*.vercel.app`.

---

### 🛠 2\. **Deploy Sanity Studio**

1. **Clone your repository**:

   ```bash
   git clone <your-repo-url>
   cd your-repo-name/studio
   ```

2. **Initialize Sanity Studio**:

   ```bash
   npm install
   npx sanity init --env
   ```

   This will generate a `.env` file in the `studio` directory.

3. **Configure environment variables:**

   In the generated .env file, add the following:

   ```bash
   SANITY_STUDIO_PREVIEW_URL="<your-vercel-app-url>"
   ```

   Replace `<your-vercel-app-url>` with the URL of your Vercel-hosted Next.js app.

4. **Import Demo Data (optional)**:

   If you want to start with some sample content, you can import the provided dataset (demoData.tar.gz) into your Sanity project. This step is optional but can be helpful for getting started quickly.

   To import the dataset, run the following command in your terminal:

   ```bash
   npx sanity dataset import demoData.tar.gz production
   ```

   > **Note:** If you're using a different dataset name, replace `production` with your dataset name.

5. **Deploy your Studio**:

   ```bash
   npx sanity deploy
   ```

   You'll be prompted to set a URL for your deployed Sanity Studio (e.g., `https://your-project-name.sanity.studio`). Take note of this URL as you'll need it in the next step.

---

### 🔧 3. **Configure Next.js with Sanity Studio URL**

1. Go to your **Vercel Project's Dashboard** > Settings > Environment Variables.
2. Add:
   - **Name**: `NEXT_PUBLIC_SANITY_STUDIO_URL`
   - **Value**: Your Sanity Studio's URL (e.g., `https://your-project.sanity.studio`).
3. Redeploy your Next.js app to apply changes.

> **Tip:** You can redeploy your Next.js app by clicking **Deployments** and clicking the three dots on the right of your latest deployment and selecting **Redeploy**.

![Screenshot of the website generated by this template](https://cdn.sanity.io/images/fkfgfb3d/production/a51cc21fe671c76cf34b8c06b2b1478283276c14-323x231.jpg)

---

## Running Locally

When developing your app, you'll run the files locally. Pushing your changes to the repo will trigger a build on Vercel and your changes will be deployed automatically. You can deploy your Sanity Studio at any time by running `npx sanity deploy` in the `studio` directory, as we did earlier.

### Run Next.js App Locally

1. **Set environment variables**:

   - Use the [Vercel CLI](https://vercel.com/docs/cli) to link and pull environment variables:
     ```bash
     cd nextjs-app
     vercel link
     vercel env pull .env.development.local
     ```
   - You can also copy `.env.local.example` to `.env.local` and complete the required values. Your `projectId` and `dataset` can be found in your Sanity project's [**Manage Console**](https://www.sanity.io/manage) and selecting your project.

2. **Install dependencies and run the Next.js app**:

   ```bash
   npm install
   npm run dev
   ```

---

### Run Sanity Studio Locally

1.  **Set up environment variables**:

- Change directories to the `studio` directory:
- Create a `.env.local` file by duplicating the `.env` file or copying `.env.local.example`
- Fill in the `projectId` and `dataset` values, same as the Next.js app.
- Set `SANITY_STUDIO_PREVIEW_URL` to the localhost URL of your Next.js app or you can leave it blank and the app will fallback to the default `localhost:3000`.
- Lastly, you'll want to add `localhost:3000` as a CORS origin in your Sanity [**Manage Console**](https://www.sanity.io/manage), located under **API** > **CORS Origins**.

2.  **Install dependencies and run the Sanity Studio**:

    ```bash
    npm install
    npm run dev
    ```

---

## 📚 Additional Resources

- 🎓 [Sanity Learn: Work-ready Next.js](https://www.sanity.io/learn/track/work-ready-next-js)
- 📖 [Sanity Documentation](https://www.sanity.io/docs)
- 💬 [Join the Sanity Community](https://slack.sanity.io)

[sanity-homepage]: https://www.sanity.io?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[presentation]: https://www.sanity.io/docs/presentation
[vercel-deploy]: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsanity-io%2Fsanity-template-nextjs-clean%2Ftree%2Fmain&project-name=nextjs-sanity-app&repository-name=nextjs-sanity-app&demo-title=NextJS%20Sanity%20Clean%20Starter%20Demo&demo-url=https%3A%2F%2Fsanity-template-nextjs-clean-preview.sanity.dev%2F&demo-image=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ffkfgfb3d%2Fproduction%2Fbdec8dc8bd60198c011b888d700009e28841601b-1490x878.png%3Ffm-jpg&demo-description=A%20starter%20template%20for%20using%20NextJS%20with%20Sanity&integration-ids=oac_hb2LITYajhRQ0i4QznmKH7gx&root-directory=nextjs-app
