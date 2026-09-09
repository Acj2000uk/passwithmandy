# Pass With Mandy

Static website prepared for GitHub and Netlify.

## Publish through GitHub

1. Create a new GitHub repository.
2. Upload every file and the assets folder from this package.
3. In Netlify, choose Add new project, then Import an existing project.
4. Select GitHub and choose the new repository.
5. Leave the build command empty.
6. Set the publish directory to a full stop: .
7. Select Deploy.

The included netlify.toml file also supplies the correct publish setting.

## Connect passwithmandy.com

After the first deployment, open Domain management in Netlify and add passwithmandy.com as the custom domain. Follow the DNS records shown by Netlify.
