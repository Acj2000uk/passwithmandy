# Pass With Mandy

Website prepared for GitHub and Netlify. It includes a secure admin page for updating the current booking month.

## Publish through GitHub

1. Create a new GitHub repository.
2. Upload every file and the assets folder from this package.
3. In Netlify, choose Add new project, then Import an existing project.
4. Select GitHub and choose the new repository.
5. The included Netlify settings will run the build.
6. Keep the publish directory set to a full stop: .
7. Select Deploy.

The included netlify.toml file also supplies the correct publish setting.

## Set the admin password

1. Open the project in Netlify.
2. Open Project configuration, then Environment variables.
3. Add a variable named ADMIN_PASSWORD.
4. Enter a strong password known only to Mandy.
5. Save the variable.
6. Trigger a new production deployment.

Do not place the password in GitHub or netlify.toml.

## Use the admin page

Open https://passwithmandy.com/admin.html

Enter the password, select the new booking month and year, then select Save availability. The public website updates without another deployment.

## Connect passwithmandy.com

After the first deployment, open Domain management in Netlify and add passwithmandy.com as the custom domain. Follow the DNS records shown by Netlify.
