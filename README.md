# A Raycast extension for PwPush - https://pwpush.com

It works only for passwords and works for the "public" PwPush offer as well as paid or self-hosted.
At first start you are asked for the URL and API key, if nothing is provided, the extension will use the default https://pwpush.com

### To Install
1. Download the package as a zip and extract (the files will remain there, so maybe chose a "final" destination)
2. Open Raycast and type "Import Extension"
3. Select the folder and import
4. If you don't have NPM installed, use Homebrew (https://brew.sh) - Install homebrew and then `brew install npm`
5. Run the “developer commands” - using the terminal, navigate to the pwpsh folder and execute `npm install && npm run dev`
6. You should be able to use the command "pwpush"


### Configuration

If you use the Self-Hosted version, add your URL https://push.domain.com and the API Key.

For Pro/Premium accounts, leave the URL empty and add your personal API key (https://pwpush.com/api_tokens). The custom URL will be grabbed automatically
