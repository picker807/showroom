# Portfolio Showroom

A fictional portfolio for independent designer Nora Mercer, built as a customer-facing demo for Aaron’s $1 HireLDS portfolio service. Nora and her projects are fictional, and the images were generated for the demo. The site uses plain HTML, CSS, JavaScript, and JSON. It needs no packages or build command.

## Preview locally

Open a terminal in the folder containing `index.html`. Run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000). Leave the terminal open while you preview. The project list loads from a JSON file, so use this local address when reviewing edits.

## Connect the service listing

Set `hireLdsListingUrl` in `data/portfolio.json` to the full HTTPS URL of your HireLDS listing. The showroom will show a **View my HireLDS listing** button. With the field blank, it tells visitors where to find the service.

## Deploy on GitHub Pages

1. Copy the contents of this folder to the root of the new `showroom` repository. Include the hidden `.gitignore` and `.nojekyll` files, along with `assets/` and `data/`.
2. Commit and push to the repo’s default branch, usually `main`.
3. In the repo, go to **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, choose the default branch and **/(root)**, and save.
4. Open the URL shown in Pages after deployment succeeds. For the `picker807` account and repo `showroom`, the standard address would be `https://picker807.github.io/showroom/`.

[GitHub Pages publishing source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Update the projects

`data/portfolio.json` contains the work cards and case studies. Put projects in the order you want them shown. Copy an existing entry and replace its unique, lowercase, hyphenated `id`, project text, and image path and description. Put project images in `assets/` and reference them with paths such as `./assets/example.webp`. The layout crops images to 4:3.

Set `featuredProject` to the ID of the project you want featured next to the opening heading. Share a case study by opening it and copying the address from the browser.

To repurpose the demo for a client, use `index.html` for the name, headline, bio, and service section. Use the variables at the top of `assets/styles.css` for the colors and type. Replace the sample images and project data with the client’s work.
