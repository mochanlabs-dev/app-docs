---
title: Cameras and RFID
category: Setup
order: 9
summary: Optional hardware — vehicle photos on every weighing, and RFID tags to fill in the vehicle number.
---

Both are optional. A weighbridge with neither works fully.

## Cameras

Open **Administration → Cameras**. There are four positions: **Bottom**, **Front**, **Rear** and **Top**. Each has its own panel.

![Camera configuration](/img/camera.png "One panel per camera position.")

1. Turn the camera on (**Enabled**).
2. Enter its **IP address**, **Username** and **Password**. These are on the camera's label or in its manual.
3. Open **Advanced** only if the camera needs a different stream path, port, transport or timeout.
4. Press **Save**, then **Test Connection**. The **Live stream** preview appears once it is saved.

When cameras are enabled, the Token page asks for **all photos** before it lets you save, and the photos are stored with the weighing. Cameras that are off are skipped.

## RFID reader

Open **Administration → RFID reader**.

![RFID reader](/img/rfid.png "Choose the connection, then check Live status.")

1. Choose the **Connection type**: **Serial (COM port)** or a network socket, depending on the reader.
2. For a serial reader, choose the **COM Port** (press **Rescan** if it isn't listed) and match **Baud rate**, **Data bits**, **Parity**, **Stop bits** and **Flow control** to the reader.
3. Choose the **Parser** for your reader and **Save**.
4. Register each tag against its vehicle in [Vehicles](/vehicles/) (the **RFID tag** column).

When a registered vehicle reaches the reader, the Token page fills in its number and shows **Tag … → UK…**.

:::tip
**Recent raw frames** shows what the reader sends. If it stays empty while you swipe a tag, the port or settings are wrong.
:::
