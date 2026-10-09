---
title: Users, roles and permissions
category: Setup
order: 7
summary: Who can sign in, and what each person is allowed to see and do.
---

## Users

Open **Administration → Users**.

![Users](/img/users.png "Each user has a role, a status and the time of their last login.")

| Action | How |
|---|---|
| **Add a user** | Press **Add user**, enter a **Username**, a **Role** and an **Initial password**. The status shows **Temp password** until the person sets their own at first sign-in. |
| **Change a role** | Pick another role in the **Role** column. |
| **Lock or unlock** | The padlock icon. A locked user can't sign in (status **Locked**). Accounts also lock after 5 wrong passwords. |
| **Reset a password** | The key icon. The person sets a new one at the next sign-in. |
| **Remove** | The bin icon. The user can no longer sign in. |

## Roles and permissions

Open **Administration → Roles and permissions**. Choose a role on the left. On the right is a grid of every screen with six switches:

| Permission | Lets the person… |
|---|---|
| **View** | Open the screen and see its data. |
| **Create** | Add new records. |
| **Edit** | Change existing records. |
| **Delete** | Remove records. |
| **Print** | Print from the screen. |
| **Approve override** | Do exceptional things, for example enter a weight by hand on the Token page. |

![Roles and permissions](/img/roles.png "Tick what each role may do. Press + to create a new role.")

Press **+** to create a role, for example *Weighbridge operator*, and tick only what that job needs. Changes apply to everyone in the role straight away.

:::tip
Give operators **View**, **Create** and **Print** on Token, Sale and Purchase only, and keep **Approve override** for a supervisor.
:::
