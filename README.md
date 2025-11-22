# SVM Panel - VPS Management System
***Made by PowerDev***

A comprehensive web-based VPS management panel built with Flask and LXC/LXD.

## Features

### User Features
- 🖥️ **Dashboard**: View all your VPS instances with real-time statistics
- 📊 **Resource Monitoring**: Live CPU, RAM, and disk usage tracking
- 🎮 **VPS Control**: Start, stop, restart VPS instances
- 🔐 **SSH Access**: Generate tmate SSH sessions directly from the panel
- 💳 **Plan Purchase**: Buy VPS plans with payment proof submission
- 👤 **Profile Management**: Update email, password, and theme preferences
- 🌓 **Light/Dark Theme**: Switch between light and dark modes

### Admin Features
- 👥 **User Management**: Add, delete, ban, suspend user accounts
- 🖥️ **VPS Management**: Create, delete, suspend, unsuspend VPS instances
- 💰 **Payment Approval**: Review and approve payment proofs
- 📊 **System Statistics**: Monitor overall system resources and usage
- ⚙️ **Panel Settings**: Customize logo, background, and announcements
- 🔧 **Resource Management**: Resize VPS resources on the fly
- 📝 **Suspension Logs**: Track all VPS suspension events

### Technical Features
- ⚡ **Auto-Monitoring**: Automatic CPU/RAM monitoring with auto-suspension
- 🔒 **Secure Authentication**: Password hashing with Werkzeug
- 📱 **Responsive Design**: Mobile-friendly interface
- 🎨 **Customizable Branding**: Upload custom logos and backgrounds
- 💾 **JSON Database**: Simple file-based data storage
- 🐳 **LXC/LXD Integration**: Full container management

## VPS Plans

| Plan | RAM | CPU | Disk | Price |
|------|-----|-----|------|-------|
| Starter | 4 GB | 2 Cores | 50 GB | ₹49/month |
| Basic | 8 GB | 4 Cores | 100 GB | ₹99/month |
| Pro | 16 GB | 6 Cores | 200 GB | ₹199/month |
| Enterprise | 32 GB | 8 Cores | 300 GB | ₹250/month |
| Ultimate | 64 GB | 12 Cores | 300 GB | ₹399/month |

## Requirements

- Ubuntu 20.04 or 22.04 (recommended)
- Root access
- Minimum 4GB RAM
- 2+ CPU cores
- 50GB+ storage

## Installation

### Quick Install (Recommended)

```bash
# Download the panel
cd /opt
git clone <repository-url> svm_panel
cd svm_panel

# Make install script executable
chmod +x install.sh

# Run installation (as root)
sudo ./install.sh
```

### Manual Installation

#### 1. Install LXC/LXD

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install LXC
sudo apt install lxc lxc-utils bridge-utils uidmap -y

# Install snapd
sudo apt install snapd -y
sudo systemctl enable --now snapd.socket

# Install LXD
sudo snap install lxd

# Add user to lxd group
sudo usermod -aG lxd $USER
newgrp lxd

# Initialize LXD
sudo lxd init
```

**LXD Init Options:**
- Would you like to use LXD clustering? **No**
- Do you want to configure a new storage pool? **Yes**
- Name of the new storage pool: **default**
- Name of the storage backend: **dir**
- Would you like to connect to a MAAS server? **No**
- Would you like to create a new local network bridge? **Yes**
- What should the new bridge be called? **lxdbr0**
- What IPv4 address should be used? **(default)**
- What IPv6 address should be used? **(default)**
- Would you like the LXD server to be available over the network? **No**
- Would you like stale cached images to be updated automatically? **Yes**

#### 2. Install Python Dependencies

```bash
# Install Python and pip
sudo apt install python3 python3-pip python3-venv -y

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

#### 3. Create Required Directories

```bash
mkdir -p data
mkdir -p static/uploads/{logos,backgrounds,payments}
```

## Running the Panel

### Development Mode

```bash
# Activate virtual environment
source venv/bin/activate

# Run the app
python3 app.py
```

Access the panel at: `http://YOUR_SERVER_IP:5000`

### Production Mode (with Gunicorn)

```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Run as System Service

Create `/etc/systemd/system/svmpanel.service`:

```ini
[Unit]
Description=SVM Panel VPS Management
After=network.target

[Service]
User=root
WorkingDirectory=/opt/svm_panel
Environment="PATH=/opt/svm_panel/venv/bin"
ExecStart=/opt/svm_panel/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 app:app

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable svmpanel
sudo systemctl start svmpanel
sudo systemctl status svmpanel
```

## Default Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin`

**⚠️ IMPORTANT:** Change the admin password immediately after first login!

## Configuration

### Environment Variables

You can customize these in `app.py`:

```python
DEFAULT_STORAGE_POOL = 'default'  # LXD storage pool name
CPU_THRESHOLD = 90                # CPU usage threshold for auto-suspension (%)
RAM_THRESHOLD = 90                # RAM usage threshold for auto-suspension (%)
CHECK_INTERVAL = 600              # Monitoring interval (seconds)
```

### Customization

1. **Logo**: Admin Panel → Settings → Upload Logo
2. **Background**: Admin Panel → Settings → Upload Background
3. **Announcement**: Admin Panel → Settings → Edit Announcement
4. **Panel Name**: Admin Panel → Settings → Edit Panel Name

## User Guide

### For Users

#### Creating an Account
1. Visit the panel URL
2. Click "Register"
3. Fill in username, email, and password
4. Click "Register"
5. Login with your credentials

#### Buying a VPS
1. Go to "Plans" page
2. Choose a plan
3. Copy your Buy ID
4. Send payment to the UPI ID provided
5. Submit payment screenshot with Buy ID
6. Wait for admin approval

#### Managing Your VPS
1. Go to Dashboard
2. Click "Manage" on any VPS card
3. Use control buttons:
   - **Start**: Power on the VPS
   - **Stop**: Power off the VPS
   - **Restart**: Reboot the VPS
   - **SSH Access**: Get SSH command
4. View real-time statistics
5. Click "Refresh Stats" to update

### For Admins

#### Creating a VPS
1. Admin Panel → Manage VPS
2. Click "Create VPS"
3. Fill in details:
   - **Username**: User to assign VPS
   - **Hostname**: Custom hostname (optional)
   - **RAM**: Memory in GB
   - **CPU**: Number of cores
   - **Disk**: Storage in GB
4. Click "Create"

#### Managing Users
1. Admin Panel → Manage Users
2. Options:
   - **Add User**: Create new account
   - **Delete**: Remove user account
   - **Ban**: Prevent login
   - **Suspend**: Temporarily disable account

#### Approving Payments
1. Admin Panel → Payments
2. Review payment screenshots
3. Click "Approve" to create VPS
4. Click "Reject" to deny payment

#### Suspending VPS
1. Admin Panel → Manage VPS
2. Find VPS in list
3. Click "Suspend"
4. Enter reason
5. VPS will be stopped and marked as suspended

## Troubleshooting

### LXC Container Won't Start

```bash
# Check LXD status
sudo systemctl status snap.lxd.daemon

# Check container logs
lxc info <container-name>

# Force stop and start
lxc stop <container-name> --force
lxc start <container-name>
```

### Permission Denied Errors

```bash
# Ensure user is in lxd group
sudo usermod -aG lxd $USER
newgrp lxd

# Check LXD permissions
sudo chown -R lxd:lxd /var/snap/lxd
```

### Port Already in Use

```bash
# Check what's using port 5000
sudo lsof -i :5000

# Kill the process or change port in app.py
```

### SSH (tmate) Not Working

```bash
# Install tmate in container
lxc exec <container-name> -- apt update
lxc exec <container-name> -- apt install tmate -y
```

## Security Recommendations

1. **Change Default Password**: Immediately change admin password
2. **Use HTTPS**: Set up SSL/TLS with Nginx reverse proxy
3. **Firewall**: Configure UFW to allow only necessary ports
4. **Regular Updates**: Keep system and packages updated
5. **Backup Data**: Regularly backup `data/` directory
6. **Monitor Logs**: Check `data/*.json` for suspicious activity

### Setting Up Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx -y

# Create config
sudo nano /etc/nginx/sites-available/svmpanel
```

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/svmpanel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## File Structure

```
svm_panel/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── install.sh             # Installation script
├── README.md              # This file
├── data/                  # Data storage
│   ├── users.json         # User accounts
│   ├── vps_data.json      # VPS information
│   ├── settings.json      # Panel settings
│   └── pending_payments.json  # Payment queue
├── static/
│   ├── css/
│   │   └── style.css      # Stylesheet
│   ├── js/
│   │   └── main.js        # JavaScript
│   └── uploads/           # Uploaded files
│       ├── logos/
│       ├── backgrounds/
│       └── payments/
└── templates/             # HTML templates
    ├── base.html
    ├── login.html
    ├── register.html
    ├── dashboard.html
    ├── manage_vps.html
    ├── plans.html
    ├── profile.html
    └── admin/
        ├── dashboard.html
        ├── users.html
        ├── vps.html
        ├── payments.html
        └── settings.html
```

## API Endpoints

### Public Routes
- `GET /` - Redirect to login or dashboard
- `GET /login` - Login page
- `POST /login` - Login authentication
- `GET /register` - Registration page
- `POST /register` - Create account
- `GET /logout` - Logout user

### User Routes (Login Required)
- `GET /dashboard` - User dashboard
- `GET /vps/manage/<vps_id>` - Manage VPS page
- `POST /vps/action/<vps_id>/<action>` - VPS control actions
- `GET /plans` - View VPS plans
- `GET /buy/<plan_key>` - Start purchase
- `GET/POST /payment/<buy_id>` - Submit payment proof
- `GET/POST /profile` - User profile

### Admin Routes (Admin Only)
- `GET /admin` - Admin dashboard
- `GET /admin/users` - Manage users
- `POST /admin/users/add` - Add user
- `GET /admin/users/delete/<username>` - Delete user
- `GET /admin/users/ban/<username>` - Ban user
- `GET /admin/users/suspend/<username>` - Suspend user
- `GET /admin/vps` - Manage VPS
- `POST /admin/vps/create` - Create VPS
- `GET /admin/vps/delete/<owner>/<vps_id>` - Delete VPS
- `POST /admin/vps/suspend/<owner>/<vps_id>` - Suspend VPS
- `GET /admin/vps/unsuspend/<owner>/<vps_id>` - Unsuspend VPS
- `GET /admin/payments` - View payments
- `GET /admin/payments/approve/<buy_id>` - Approve payment
- `GET /admin/payments/reject/<buy_id>` - Reject payment
- `GET/POST /admin/settings` - Panel settings

## Support

For issues, questions, or contributions, please contact the administrator.

## License

This project is proprietary software. All rights reserved.

---

**SVM Panel** - Professional VPS Management Solution 

**Made by PowerDev**
