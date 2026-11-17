# VPS Security Hardening Guide — NextGen IT Hub

This guide details the production hardening procedures for provisioning an **Ubuntu 22.04 / 24.04 LTS** server hosting **NextGen IT Hub**, based on the **CIS Ubuntu Linux Benchmark Level 1**.

---

## 1. Initial Host Setup & Non-Root User Provisioning

### Step 1: Create Dedicated Sudo User
Never operate directly as `root`:

```bash
# Add application administrator user
adduser nextgenadmin
usermod -aG sudo nextgenadmin

# Set up SSH directory
mkdir -p /home/nextgenadmin/.ssh
chmod 700 /home/nextgenadmin/.ssh
cp /root/.ssh/authorized_keys /home/nextgenadmin/.ssh/
chown -R nextgenadmin:nextgenadmin /home/nextgenadmin/.ssh
chmod 600 /home/nextgenadmin/.ssh/authorized_keys
```

### Step 2: Hardened SSH Configuration
Edit `/etc/ssh/sshd_config.d/99-hardened.conf`:

```ini
Port 2222
Protocol 2
PermitRootLogin no
PasswordAuthentication no
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers nextgenadmin
KexAlgorithms curve25519-sha256@libssh.org,diffie-hellman-group-exchange-sha256
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
```

Test syntax and restart SSH:
```bash
sudo sshd -t && sudo systemctl restart ssh
```

---

## 2. Firewall Configuration (UFW)

Lock down inbound network traffic. Only standard HTTP, HTTPS, and your custom SSH port should be exposed:

```bash
# Set baseline default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow custom SSH port
sudo ufw allow 2222/tcp comment 'SSH Daemon'

# Allow Web Ports
sudo ufw allow 80/tcp comment 'HTTP (Let\'s Encrypt challenge)'
sudo ufw allow 443/tcp comment 'HTTPS'

# Enable Firewall
sudo ufw --force enable
sudo ufw status verbose
```

---

## 3. Intrusion Prevention with Fail2ban

Install and configure `fail2ban` to ban IP addresses that exhibit malicious signs like password brute forcing or scanner behavior:

```bash
sudo apt update && sudo apt install -y fail2ban
```

Create `/etc/fail2ban/jail.local`:

```ini
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
banaction = ufw
ignoreip = 127.0.0.1/8 ::1

[sshd]
enabled = true
port    = 2222
mode    = aggressive

[nginx-http-auth]
enabled = true
port    = http,https
logpath = /var/log/nginx/error.log

[nginx-botsearch]
enabled  = true
port     = http,https
logpath  = /var/log/nginx/access.log
maxretry = 2
```

Enable and start service:
```bash
sudo systemctl enable fail2ban && sudo systemctl restart fail2ban
sudo fail2ban-client status
```

---

## 4. Automated Security Updates (Unattended-Upgrades)

Ensure critical OS security patches and kernel updates apply automatically:

```bash
sudo apt install -y unattended-upgrades update-notifier-common
sudo dpkg-reconfigure -plow unattended-upgrades
```

Verify `/etc/apt/apt.conf.d/50unattended-upgrades`:

```ini
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
};
Unattended-Upgrade::Package-Blacklist {
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::InstallOnShutdown "false";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
```

---

## 5. PostgreSQL Database Hardening

1. **Bind Exclusively to Localhost / Private VPC**:
   In `/etc/postgresql/16/main/postgresql.conf`:
   ```ini
   listen_addresses = '127.0.0.1,172.18.0.1'
   ssl = on
   password_encryption = scram-sha-256
   ```

2. **Restrict Client Authentication**:
   In `/etc/postgresql/16/main/pg_hba.conf`:
   ```ini
   # TYPE  DATABASE        USER            ADDRESS                 METHOD
   local   all             postgres                                peer
   local   all             all                                     scram-sha-256
   host    nextgen_it_hub  nextgen_user    127.0.0.1/32            scram-sha-256
   host    nextgen_it_hub  nextgen_user    ::1/128                 scram-sha-256
   # Drop all other external connection attempts
   host    all             all             0.0.0.0/0               reject
   ```

3. **Least-Privilege Database User**:
   ```sql
   REVOKE ALL ON DATABASE nextgen_it_hub FROM PUBLIC;
   GRANT CONNECT ON DATABASE nextgen_it_hub TO nextgen_user;
   GRANT USAGE ON SCHEMA public TO nextgen_user;
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO nextgen_user;
   GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO nextgen_user;
   ```

---

## 6. Kernel & Network Tuning (`sysctl`)

Apply network hardening against SYN floods and IP spoofing in `/etc/sysctl.d/99-security.conf`:

```ini
# Prevent SYN Flood Attacks
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 4096
net.ipv4.tcp_synack_retries = 2

# IP Spoofing & Redirect Protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0

# Ignore ICMP Broadcast Requests
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Disable Source Packet Routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
```

Apply immediately:
```bash
sudo sysctl -p /etc/sysctl.d/99-security.conf
```
