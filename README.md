# codezilla


TrustLens.
Problem Statement FT1: AI-Powered Fraud Detection System

Context: Financial fraud is a growing concern (FTC reports $12.5B losses in 2024). AI techniques are increasingly used to spot fraudulent behavior. This challenge is to create a real-time fraud detection tool for transactions.

Presenting You the - "TRUSTLENS.", Revolutionizing Financial Security by Detecting Anomalies Before They Become Threats.

  FRONTEND🔗 - https://codezilla-1tjl.vercel.app/
  BACKEND 🔗 -

Summary: In a World where cash is most expensive commodity , cyber thefts, fraud and scamming has become a common entity . TrustLens. Provides an interface whereby, A client can verify the nature of the transaction , and characterstics of the sender, whether he is flagged or monitored for malicious activity. We provide a User Friendly Interface to propvide client a secure platform to check for scam intrustions .

FRAUD CHECK FEATURE : Using basic inputs from the user and transcation id incase transcation is dopne , we aim to flag reciever based upon certain behaviuours trained under GNN - Graphical Neural Network and certain criterias like repeated payments , different locations and other such algorithms which is implemented/yet to be implemented . We provide this easy access website mainly to check transcation Fraud probabilty rate , whereby clients could view the Flagged Reciever , but also the reason for being flagged

GNN : We employ a two-layer GraphSAGE-based Graph Neural Network (GNN) model to learn rich node representations over the transaction–entity graph, where nodes represent users, accounts, or transactions, and edges denote relationships such as monetary transfers or account linkages.

This model aggregates neighborhood features across two hops, enabling it to capture both local and contextual transactional behavior patterns. The output of the final layer is a scalar or vector representation referred to as the graph_score, which reflects the anomaly likelihood, trustworthiness, or risk associated with a specific node (e.g., transaction or entity).

The graph_score is further utilized downstream for fraud detection, risk ranking, or alert prioritization, depending on the system's objective.

In this project , we bring in the concept of Remote Graphical Neural Network (RGNN) - A minimal based neural networking dynamics.

Posssible future version spinoffs:

Blockchain to prevent fake flagging and unflagging by scammmers/potential scammers
PAYMENT GATEWAY TO PREVENT ON SIGHT SCAMS TOO.
IP LOCATION CHANGES HISTORY BY GEOFENCING THE PAYMENT
TRANSACTION BEHAVIOURS SOURCED BY IDLE TIME OF USERS
CARD USING PATTERN BY CLIENT FOR TRANSCATION (I.E - if he/she uses card for e-commerce websites or in supermarkets),
Sure! Here's a simplified, plain-text version of your README file, designed to be easy to read and suitable for display on GitHub:

TrustLens – AI-Powered Fraud Detection System
Revolutionizing Financial Security by Detecting Anomalies Before They Become Threats

Problem Statement – FT1: Real-Time Fraud Detection

Financial fraud is rising fast, with over $12.5 billion in losses reported in 2024. TrustLens is built to help detect and prevent fraud in real time using AI.

Overview

TrustLens provides a secure and easy-to-use platform where users can:

Check the nature of a transaction
Verify if the sender is flagged for suspicious activity
View fraud probability scores and reasons for flagging
Fraud Check Feature

Users can enter basic transaction details or a transaction ID to:

See if the receiver is flagged
Understand why (e.g., repeated payments, location changes)
Get a fraud probability score
Graph Neural Network (GNN) Model

TrustLens uses a two-layer GraphSAGE-based GNN to analyze transaction behavior:

Nodes represent users, accounts, or transactions
Edges show relationships like transfers or account links
The model looks at nearby connections to detect patterns
Outputs a score showing risk or anomaly likelihood
This score helps rank risks and prioritize alerts.

Future Features (Coming Soon)

Blockchain to prevent fake flagging/unflagging
Payment gateway to block scams during transactions
IP location tracking using geofencing
Behavior analysis based on user idle time
Card usage profiling (e.g., e-commerce vs. retail)
