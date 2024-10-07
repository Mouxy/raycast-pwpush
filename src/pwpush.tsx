import { Form, ActionPanel, Action, Detail, Clipboard, showHUD, getPreferenceValues, LocalStorage, useNavigation, openExtensionPreferences } from "@raycast/api";
import fetch from "node-fetch";
import { useEffect, useState } from "react";

type PwPushFormValues = {
  password: string;
  expireAfterDays?: string;
  expireAfterViews?: string;
  note?: string;  // New note field for reference
};

interface Preferences {
  serverUrl?: string;
  apiKey?: string;
}

export default function Command() {
  const { push, pop } = useNavigation();  // Allows us to navigate between screens and close the interface
  const [hasSeenPrompt, setHasSeenPrompt] = useState<boolean>(false);
  const preferences = getPreferenceValues<Preferences>(); // Get stored preferences (server URL, API key)

  // Set default server URL (PwPush public version)
  const defaultServerUrl = "https://pwpush.com";

  // Check if the user has already been prompted about the preferences
  useEffect(() => {
    async function checkFirstRun() {
      const seenPrompt = await LocalStorage.getItem<boolean>("hasSeenPrompt");

      if (!seenPrompt) {
        // Show a detailed view with the information and a button to open preferences
        push(<PreferencesInfoScreen />);
        await LocalStorage.setItem("hasSeenPrompt", true); // Mark that the user has been informed
        setHasSeenPrompt(true);
      }
    }
    checkFirstRun();
  }, []);

  async function handleSubmit(values: PwPushFormValues) {
    const { password, expireAfterDays, expireAfterViews, note } = values;

    if (!password) {
      push(<Detail markdown="### Error\n\nPassword is required!" />);
      return;
    }

    // Use the preferences for server URL or default to the public service
    const finalServerUrl = preferences.serverUrl && preferences.serverUrl.length > 0
      ? preferences.serverUrl
      : defaultServerUrl;

    const baseUrl = `${finalServerUrl}/p.json`;

    const requestData = {
      password: {
        payload: password,
        expire_after_days: parseInt(expireAfterDays || "1"),
        expire_after_views: parseInt(expireAfterViews || "10"),
        note: note || "",  // Include the note field if provided
      },
    };

    // Set headers if an API key is provided
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    if (preferences.apiKey && preferences.apiKey.length > 0) {
      headers["Authorization"] = `Bearer ${preferences.apiKey}`;
    }

    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create push: ${response.statusText}`);
      }

      const result = await response.json();
      const pushUrl = result.html_url || `${finalServerUrl}/p/${result.url_token}`;

      // Copy the URL to the clipboard
      await Clipboard.copy(pushUrl);

      // Show the HUD notification
      await showHUD("Password push URL copied to clipboard");

      // Close the interface
      pop();
      
    } catch (error) {
      push(<Detail markdown={`### Error\n\nFailed to push password: ${error.message}`} />);
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="password" title="Password" placeholder="Enter your password" />
      <Form.TextField id="expireAfterDays" title="Expire After Days (optional)" placeholder="1" />
      <Form.TextField id="expireAfterViews" title="Expire After Views (optional)" placeholder="10" />
      <Form.TextField id="note" title="Note (optional)" placeholder="Enter a note for reference" />  {/* Note field */}
    </Form>
  );
}

function PreferencesInfoScreen() {
  return (
    <Detail
       markdown={`
### Optional Setup

If you have a self-hosted or paid PwPush account, you can configure the server URL and API key in preferences.
`}
      actions={
        <ActionPanel>
          <Action title="Open Preferences" onAction={openExtensionPreferences} />
        </ActionPanel>
      }
    />
  );
}
