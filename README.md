# vrwebwall
Get an overview over a website structure by placing its pages around you in a VR environment

Daemon-Skript unter /etc/systemd/system/vrcollab.service einrichten.

```
[Unit]
Description=vrcollab
After=network.target
[Service]
Type=idle
WorkingDirectory=/vrcollab
ExecStart=/usr/bin/node /vrcollab/app.js
[Install]
WantedBy=default.target
```

Daemon starten

```sh
chmod 644 /etc/systemd/system/vrcollab.service
systemctl enable vrcollab.service
systemctl daemon-reload
systemctl start vrcollab.service
```