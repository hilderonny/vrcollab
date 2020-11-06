# vrcollab

Doku unter https://docs.google.com/document/d/1V8k9mJLn_GRwR6bbgblTkVsROENnmntKAi2-1Fc32CA/edit

## Installation

Zuerst habe ich Postgres installiert.

```sh
apt update
apt install postgresql postgresql-contrib
sudo -u postgres psql
\password postgres
\q
```

Danach das Repository heruntergeladen und eingerichtet.

```sh
mkdir -p /github/hilderonny
cd /github/hilderonny
git clone https://github.com/hilderonny/vrcollab.git
cd vrcollab
git config --global user.name "hilderonny"
git config --global user.email "hilderonny2014@gmail.com"
git config credential.helper store
npm install
nano /etc/systemd/system/vrcollab.service
chmod 644 /etc/systemd/system/vrcollab.service
systemctl enable vrcollab.service
systemctl daemon-reload
service vrcollab start
```

Inhalt der Dienst-Datei `/etc/systemd/system/vrcollab.service`:

```
[Unit]
Description=vrcollab
After=network.target
[Service]
Type=idle
WorkingDirectory=/github/hilderonny/vrcollab
ExecStart=/usr/bin/node /github/hilderonny/vrcollab/app.js
Environment="PGUSER=postgres"
Environment="PGHOST=127.0.0.1"
Environment="PGPASSWORD=<postgrespassword>"
Environment="PGDATABASE=vrcollab"
Environment="PGPORT=5432"
[Install]
WantedBy=default.target
```

## Datenbank

Im Prinzip verwende ich die Datenbank wie eine NoSQL Datenbank.

|elements|Hier werden alle Elemente gespeichert|
|---|---|
|id|Generierte UUID|
|data|JSON-Struktur mit beliebigen Informationen. Die Hierarchie und gesamte Bedeutung ist hier drin|

|users|Benutzerinfos|
|---|---|
|id|UUID|
|favorites|Auflistung aller Objekte, die im Schnellzugriff liegen sollen. JSON-Array|

Anlegen mit:

```sh
sudo -u postgres psql
```

```sql
CREATE DATABASE vrcollab;
\c vrcollab
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE elements (id uuid DEFAULT uuid_generate_v4(), data json, PRIMARY KEY (id));
CREATE TABLE users (id uuid DEFAULT uuid_generate_v4(), favorites json, PRIMARY KEY (id));
\q
```