## Format on save with eslint-prettier in VSCode
1. Install Prettier VSCode extension: [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

2. Enable formatting on save in your User or Workspace settings.
```javascript
{
  "editor.formatOnSave": false,
  "[javascript]": {
    "editor.formatOnSave": true
  }
}
```

3. Enable `eslint-prettier` in Prettier VSCode extension by adding this to your workspace settings in VSCode.
```javascript
{
  "prettier.eslintIntegration": true
}
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

## React Intl

Updating localisation:

    yarn extract:messages
    yarn manage:translations

Note: React fragments in form of `<></>` are not parsable by `react-intl` scripts above. You can however use `<React.Fragment>` which works.

Note: `try {...} catch {}` will also not work. You must use `try {...} catch (err) {}` even if you do not handle the error.

## Local testing of subdomains

If you want to test different testnets localy, you need to setup local subdomains (for cookies to work properly).
On linux you can open `/etc/hosts` and add those lines:

    127.0.0.1 local-seiza.com
    127.0.0.1 test1.local-seiza.com
   
Now open http://local-seiza.com:port or http://test1.local-seiza.com:port and you are ready to go. Exchange `port` for whatever you use (probably 3000).

