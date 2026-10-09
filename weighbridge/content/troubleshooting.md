---
title: Fix common problems
category: Troubleshooting
order: 1
summary: What you see, what it means, and what to do. Start at the top of the table.
---

## Quick fixes

| What you see | What it means | What to do |
|---|---|---|
| **Starting Weighbridge…** stays on screen | The app is waiting for its database to wake up. This is normal for a few seconds after Windows starts. | Wait. It opens by itself. After about 20 seconds it explains the problem and keeps retrying. |
| **Can't connect to the database** | SQL Server isn't running or can't be reached. | Open **Services** on Windows and start **SQL Server (…)**. Press **Try again**. On a client computer, check the server computer is on. |
| **The Weighbridge service isn't responding** | The background service didn't start. | Close and reopen the app. If it repeats, restart the computer. |
| Weight shows `…` or **Waiting for stable weight…** | No weight is coming from the scale, or it isn't steady. | Check the indicator is on and the cable is in. See [Weighbridge and COM port](/scale/). |
| **Activate Weighbridge** appears on a computer that worked yesterday | The license couldn't be checked for longer than its grace period, or it has expired. | Check the internet, then press **Activate**/**Check now**. If the license expired, contact Mochan Labs. See [License renewal](/license-renewal/). |
| **Tally Sync** says Tally can't be reached | Tally isn't open, or Host/Port are wrong. | Open Tally with the company loaded, then use **Test Connection** in [Tally](/tally/). |
| Receipts print the wrong size | Paper setting doesn't match the printer. | [Printer and slip layout](/printer/): choose A4 or the right roll size. |
| A report is empty | The date range doesn't cover the day you want. | Widen **From** and **To**. See [Reports](/reports/). |
| A user can't see a screen | Their role doesn't have access. | An administrator changes it in [Users, roles and permissions](/users/). |
| Update message appears | A new version is available. | Choose to download. Keep working. Restart when asked. See [Update the app](/updates/). |

![The start-up screen](/img/startup-loader.png "Starting Weighbridge… while the database connects.")

![The 'can't connect' message](/img/startup-problem.png "If it takes more than ~20 seconds, the app says what is wrong and keeps trying.")

## I am locked out of the Admin account

Open **Command Prompt as administrator** on the Weighbridge computer and run:

```
"C:\Program Files\Weighbridge\resources\api\Weighbridge.Api.exe" --reset-admin-password
```

This sets the `Admin` password back to `Admin@123` and asks for a new one at the next sign-in.

## Check what the database holds

```
"C:\Program Files\Weighbridge\resources\api\Weighbridge.Api.exe" --diagnose-database
```

It prints which SQL Server instance the app uses and how many users, parties and vehicles it holds.

## Where the logs are

The app writes its log files to `%LOCALAPPDATA%\Weighbridge\logs`. Send the newest file to [support](/support/) with a short description of what you were doing.
