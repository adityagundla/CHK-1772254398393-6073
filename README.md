# 🔗 DataChain – Decentralized Data Ownership System




\

A **blockchain-based platform** that enables users to **securely own, control, and monetize their personal data**.
DataChain ensures **privacy, transparency, and security** using decentralized technologies like **Blockchain and IPFS**.

---

# 👨‍💻 Team Saviours

### Team Members

* **Aditya Gundla**
* **Koushik Chilweri**
* **Prajwal Sanade**
* **Gaurav Jadkar**

---

# 📌 Problem Statement

Most current systems store personal data in **centralized servers**, where organizations control user data.
This leads to problems such as:

* ❌ Lack of data ownership
* ❌ Data misuse by third parties
* ❌ Security breaches
* ❌ No transparency in data access

### 💡 Solution

**DataChain** provides a **decentralized data ownership system** using **Blockchain technology** where:

* Users fully **own their data**
* Access is **controlled by the user**
* Data history is **transparent and immutable**
* Storage is **secure and decentralized**

---

# 🛠 Tech Stack

### Frontend

* React
* Vite
* JavaScript

### Backend

* Python
* Flask REST API

### Blockchain

* Solidity Smart Contracts
* MetaMask Wallet Integration

### Storage

* IPFS (InterPlanetary File System)

---

# 🏗 System Architecture

User → React Frontend → Flask API → Smart Contract → Blockchain
                                                  ↓
                                              IPFS Storage

---

# 📂 Project Structure

```
DataChain
│
├── backend
│   ├── app.py
│   ├── routes
│   ├── services
│   └── requirements.txt
│
├── contracts
│   ├── DataAccess.sol
│   └── deployment scripts
│
└── frontend
    │
    ├── org-frontend
    │   └── Organization Dashboard
    │
    └── user-frontend
        └── User Dashboard
```

---

# ⭐ Why Choose DataChain?

### 🔐 Blockchain-Based Ownership

Ensures **true data ownership** using decentralized blockchain technology.

### 📦 Secure Storage

Documents are **encrypted and stored on IPFS**, making them tamper-proof.

### 👤 Full Data Ownership

Users maintain **complete control over their personal data**.

### 📜 Immutable History

All access requests are **recorded permanently on the blockchain**.

### 🎛 Permission Control

Users can **grant or revoke access permissions anytime**.

### 💼 Digital Wallet Integration

MetaMask allows users to **securely interact with blockchain services**.

### 🔍 Transparency

Users can **track who accessed their data and when**.

---

# ⚙ How It Works

### 1️⃣ Upload Document

Users upload their document through the **User Dashboard**.

### 2️⃣ Store on IPFS

The document is **encrypted and stored on IPFS**.

### 3️⃣ Blockchain Verification

The **document hash is recorded on the blockchain** using a smart contract.

### 4️⃣ Access Request

Organizations can request access to user documents.

### 5️⃣ Permission Management

Users can **approve or reject access requests**.

### 6️⃣ Audit Trail

All activities are **logged on blockchain for transparency**.

---

# 🚀 Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/DataChain.git
cd DataChain
```

---

## 2️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend will run on:

```
http://localhost:5000
```

---

## 3️⃣ Frontend Setup

### User Dashboard

```bash
cd frontend/user-frontend
npm install
npm run dev
```

### Organization Dashboard

```bash
cd frontend/org-frontend
npm install
npm run dev
```

---

## 4️⃣ Smart Contract Deployment

1. Open **Remix IDE**
2. Deploy `DataAccess.sol`
3. Connect using **MetaMask**
4. Copy deployed contract address to frontend/backend

---

# 📊 Key Features

✔ Decentralized data ownership
✔ Blockchain-based access control
✔ Secure document storage using IPFS
✔ Smart contract verification
✔ Transparent audit trail
✔ User and organization dashboards

---

#
