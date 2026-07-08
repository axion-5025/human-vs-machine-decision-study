HUMAN VS MACHINE DECISION STUDY — MANAGER DEMO

WHAT TO SEND
Send the complete project folder or a ZIP downloaded from the GitHub repository.
Do not send only these launcher files; the application source and Docker files are required.

MANAGER REQUIREMENT
Install Docker Desktop for Windows and start it before launching the application.

WHERE TO PLACE THESE FILES
Copy these four PowerShell files into the project root, beside:
- README.md
- .env.release.example
- infrastructure\
- backend\
- frontend\

START
1. Start Docker Desktop.
2. Open PowerShell in the project folder.
3. Run:

   powershell -ExecutionPolicy Bypass -File .\START-MANAGER-DEMO.ps1

4. The first run builds containers and may take several minutes.
5. The browser opens at http://localhost:8080.

STOP
Run:

   powershell -ExecutionPolicy Bypass -File .\STOP-MANAGER-DEMO.ps1

RESET ALL LOCAL DEMO DATA
Run:

   powershell -ExecutionPolicy Bypass -File .\RESET-MANAGER-DEMO.ps1

DIAGNOSTICS
Run:

   powershell -ExecutionPolicy Bypass -File .\VIEW-DEMO-LOGS.ps1

IMPORTANT
- Keep Docker Desktop running during the demo.
- Do not email .env or .env.release files.
- Do not include node_modules, .venv, coverage, test reports, or private credentials.
- For the easiest professional delivery, deploy the application online and send one URL instead.
