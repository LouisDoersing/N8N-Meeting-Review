# N8N-Meeting-Review

Full System Test (Frontend + Backend)
This method allows testing the complete system including the user interface.
1. Clone the repository
git clone https://github.com/LouisDoersing/N8N-Meeting-Review.git
and navigate the local directory.
2. Configure the webhook URL
Open the file:
src/App.jsx
Replace the placeholder API_URL with the active webhook endpoint.
3. Install Node.js
Install a current Node.js LTS version from:
https://nodejs.org
4. Start and test the system
npm install
npm run dev
Then:
Open the localhost URL shown in the terminal.
Upload one of the predefined transcripts from:
/transcripts/
Fill in the form fields:

Name: any test name

Email: your email address (to receive feedback)

Meeting goal: e.g. “Reflect on developments since the workshop”

Meeting type: e.g. “Retrospective”

Click Submit.

The generated feedback will be delivered via email after ~120 seconds.

Test Scenarios
The folder /transcripts/ contains three predefined transcripts demonstrating core system behavior. These correspond to the evaluation scenarios described in Chapter 5 of the thesis.
