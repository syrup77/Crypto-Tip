PROJECT: CryptoTip — Minimalist Web3 Tipping Website

You are the lead engineer and autonomous coding agent responsible for building a COMPLETE, RUNNABLE Web3 application.

You are working directly inside the current repository:

C:\Crypto-Tip

The repository is currently empty.

Your job is to BUILD THE ACTUAL APPLICATION, not explain how I could build it.

You have access to the local Windows environment, including PowerShell, Node.js, npm, and the filesystem.

You are authorized to:

* create files
* create folders
* edit files
* install npm dependencies
* run shell commands
* run development/build/lint/type-check commands
* inspect errors
* fix errors
* repeat the process until the application is in the best verified state possible

Do not merely give me code in chat. Make the changes directly in the repository.

==================================================
PRODUCT

Build a minimalist / brutalist personal crypto tipping website called:

CryptoTip

The concept:

A visitor lands on a personal page.

They see a short profile/introduction and a clear:

“BUY ME A COFFEE”

call-to-action.

The visitor can:

1. Connect their external crypto wallet.
2. See their connected wallet address.
3. See the current network.
4. Switch to Sepolia if necessary.
5. Choose a tip amount.
6. Confirm the transaction through their wallet.
7. Send native testnet ETH directly to the configured recipient wallet.
8. See the transaction lifecycle.
9. See a Sepolia block explorer link after successful confirmation.

This MUST be a REAL blockchain transaction.

Do NOT create a fake payment simulation.

Do NOT mock the transaction.

Do NOT pretend a transaction succeeded when it did not.

The first and only network implementation for this project is:

Ethereum Sepolia Testnet.

Do NOT implement Ethereum mainnet.

==================================================
TECH STACK

Use:

* Next.js
* TypeScript
* Tailwind CSS
* wagmi
* viem

Use the current stable versions available through npm at implementation time, with versions that are actually compatible with one another.

Do not introduce unnecessary dependencies.

Prefer the simplest modern architecture that satisfies the requirements.

IMPORTANT:

After installing dependencies, inspect the ACTUAL installed package versions and use APIs compatible with those versions.

Do NOT blindly copy old wagmi/viem tutorials.

Do NOT invent APIs.

If an API has changed, use the API that exists in the installed version.

==================================================
PHASE 0 — ENVIRONMENT CHECK

Before implementing anything:

1. Inspect the current directory.
2. Confirm whether it is empty.
3. Check:
    * node -v
    * npm -v
4. Determine the appropriate Next.js project structure.
5. Check whether npm/network access works.

If npm/network access works, proceed normally.

If package installation fails because of a network/environment restriction:

* do NOT pretend installation succeeded
* do NOT fabricate package versions
* report the exact limitation
* still create whatever project files can safely be created
* continue with all work that can genuinely be completed
* clearly identify what remains unverified

Do not stop merely because a non-critical tool command fails.

==================================================
PHASE 1 — INITIALIZE

Because the repository is empty:

Create a proper Next.js + TypeScript project directly in the current repository.

Configure Tailwind CSS using the approach appropriate for the installed/current Next.js version.

Install only the dependencies actually required.

At minimum, the implementation should use:

* next
* react
* react-dom
* typescript
* wagmi
* viem

Add other dependencies only when genuinely necessary.

Create:

* package.json
* Next.js configuration
* TypeScript configuration
* Tailwind configuration if required by the selected setup
* app/source structure
* .gitignore
* .env.example

Do not create unnecessary boilerplate.

==================================================
BLOCKCHAIN CONFIGURATION

Use Ethereum Sepolia.

The application must only operate on Sepolia.

Use the appropriate current wagmi/viem chain configuration for Sepolia.

The recipient wallet address MUST come from:

NEXT_PUBLIC_TIP_RECIPIENT_ADDRESS

Example:

NEXT_PUBLIC_TIP_RECIPIENT_ADDRESS=0xYOUR_TESTNET_RECIPIENT_ADDRESS

NEVER hard-code the recipient wallet address into source code.

NEVER hard-code a private key.

NEVER request or store a seed phrase/private key.

The recipient address is public information and may safely be exposed through a NEXT_PUBLIC environment variable.

Validate the recipient address before attempting a transaction.

==================================================
WALLET CONNECTION

Use modern wagmi wallet connection architecture compatible with the installed wagmi version.

Support common injected wallets such as MetaMask where available.

The application should gracefully handle the absence of an injected wallet.

Disconnected UI:

CONNECT WALLET

Connected UI should show a shortened address, for example:

0x1234…abcd

Provide disconnect functionality where appropriate.

Handle:

* connection
* disconnection
* account changes
* network changes
* rejected connection requests

Do not crash if the wallet is unavailable.

==================================================
NETWORK SAFETY

This application is TESTNET ONLY.

Display clearly:

SEPOLIA TESTNET

If the wallet is connected to another network:

* do NOT allow the transaction
* clearly tell the user they are on the wrong network
* provide a “SWITCH TO SEPOLIA” action when supported
* prevent the tip transaction until Sepolia is active

Never silently switch networks.

Never submit a tip transaction to Ethereum mainnet.

The application should fail safely if the network is wrong.

==================================================
TIP AMOUNTS

Provide simple preset options:

0.001 ETH
0.002 ETH
0.005 ETH

Also provide a custom amount input.

The user selects one amount and presses:

BUY ME A COFFEE ☕

Validate:

* amount is present
* amount is greater than zero
* amount is a valid numeric ETH amount
* amount can be safely converted to the correct wei representation
* recipient address is valid
* wallet is connected
* connected chain is Sepolia

Use viem’s appropriate ETH parsing utilities rather than manually calculating wei.

Do not use floating-point arithmetic for transaction values where it could cause precision issues.

==================================================
REAL TRANSACTION

The tip must be a native ETH Sepolia transaction.

Use the appropriate current wagmi/viem transaction APIs.

The transaction must be initiated through the user’s connected wallet.

The user must receive the wallet confirmation prompt.

The application must NOT:

* request a private key
* construct a fake transaction
* use a simulated success state
* pretend to broadcast a transaction
* send funds from a server-controlled wallet

The transaction sender is always the connected user’s wallet.

The recipient is:

NEXT_PUBLIC_TIP_RECIPIENT_ADDRESS

==================================================
TRANSACTION LIFECYCLE

The UI must distinguish between:

1. Wallet disconnected
2. Connecting
3. Connected
4. Wrong network
5. Ready to tip
6. Wallet confirmation requested
7. Transaction submitted
8. Transaction pending
9. Transaction confirmed
10. User rejected transaction
11. Transaction failed

Do not show successful payment merely because the user clicked the button.

After submission, track the transaction appropriately.

Only show:

COFFEE SENT ☕

after the transaction has actually been confirmed successfully.

After success provide:

VIEW TRANSACTION

The link MUST point to the correct Sepolia block explorer transaction URL.

Use the correct explorer URL for Sepolia rather than an Ethereum mainnet URL.

==================================================
BALANCE

Where practical, display the connected wallet’s native ETH Sepolia balance.

Use the appropriate current wagmi/viem balance functionality.

Handle insufficient balance gracefully.

If the balance is insufficient for the selected amount and expected gas:

* prevent or gracefully handle the transaction
* show a useful message

Do not promise exact gas availability if the wallet/provider does not provide enough information.

==================================================
UI / DESIGN

The visual design is VERY important.

Create a deliberately minimalist brutalist personal website.

Visual direction:

* black and white base
* extremely high contrast
* bold typography
* sharp rectangular borders
* thick borders where appropriate
* strong spacing
* large headings
* simple controls
* raw/technical aesthetic
* responsive
* intentional asymmetry where it improves the design
* little or no animation
* minimal rounded corners or none
* no unnecessary decorative elements

DO NOT make it look like a generic Web3 template.

Absolutely avoid:

* glowing purple crypto gradients
* glassmorphism
* floating blobs
* generic SaaS dashboard aesthetics
* excessive cards
* excessive animations
* unnecessary charts
* unnecessary navigation
* fake statistics
* unnecessary sections

The site should look like a designer/developer intentionally created a brutalist Web3 tipping page.

==================================================
PAGE

Create ONE polished landing page.

Suggested structure:

Top:

CRYPTO TIP

Hero:

BUY ME A COFFEE.
ON-CHAIN.

Short personal/project introduction.

Wallet connection area.

Network status.

Wallet balance.

Tip amount selector.

Custom amount.

Main CTA:

BUY ME A COFFEE ☕

Transaction/status area.

Small technical footer:

BUILT WITH NEXT.JS / WAGMI / VIEM

SEPOLIA TESTNET

TRANSACTIONS ARE EXECUTED DIRECTLY FROM YOUR CONNECTED WALLET.

You may improve the copy and layout while keeping the page focused.

Do NOT turn this into a multi-page application.

==================================================
SECURITY

NEVER request, store, display, or transmit:

* seed phrases
* private keys
* wallet passwords
* secret recovery phrases

Never ask the user to paste a private key.

Never include a private key in .env files.

Never expose server-side secrets to client-side code.

Only the public recipient address belongs in:

NEXT_PUBLIC_TIP_RECIPIENT_ADDRESS

==================================================
ERROR HANDLING

Gracefully handle:

* wallet not installed
* wallet connection rejected
* account changed
* network changed
* wrong network
* invalid recipient address
* invalid amount
* insufficient balance
* user rejects transaction
* transaction failure
* RPC/provider failure
* unexpected errors

Never leave the UI permanently stuck in a loading state.

Display useful, human-readable errors.

Do not expose raw technical stack traces to normal users.

==================================================
CODE QUALITY

Use:

* TypeScript
* strong typing
* reusable components where appropriate
* small focused components
* clean naming
* minimal abstraction
* no duplicated logic
* no fake functions
* no unnecessary libraries

Avoid any.

If an any type is genuinely unavoidable because of a third-party API boundary, keep it isolated and explain why.

Keep the architecture understandable to a beginner/intermediate developer who wants to show this project in a portfolio.

==================================================
ENVIRONMENT FILES

Create:

.env.example

containing:

NEXT_PUBLIC_TIP_RECIPIENT_ADDRESS=0xYOUR_TESTNET_RECIPIENT_ADDRESS

If the chosen architecture genuinely requires another environment variable, add it and document why.

Do NOT create a real .env.local containing secrets.

Ensure .env.local is ignored by git.

==================================================
VERIFICATION LOOP

This section is CRITICAL.

You are an autonomous coding agent.

Do NOT stop immediately after generating files.

After implementation:

1. Install dependencies.
2. Inspect installed versions.
3. Run the project’s available validation commands.
4. Run:
    npm run build
5. Run lint if configured.
6. Run TypeScript checking if separately available.
7. Start the development server when practical.
8. Inspect errors.
9. Fix errors.
10. Run the checks again.
11. Repeat until the project reaches a genuinely verified state.

When debugging:

* read the actual error
* identify its root cause
* modify the relevant files
* rerun the command
* do not simply suppress the error

Do NOT use --force, --legacy-peer-deps, or similar dependency bypasses merely to make installation succeed unless there is a legitimate, understood reason.

Do not downgrade packages simply to make an old tutorial work.

==================================================
STATIC WEB3 AUDIT

After the build succeeds, inspect the implementation specifically for:

* incorrect wagmi APIs
* incorrect viem APIs
* deprecated APIs
* incorrect Sepolia configuration
* accidental mainnet configuration
* incorrect transaction lifecycle handling
* incorrect wei conversion
* recipient address validation
* environment variable mistakes
* client/server component mistakes
* hydration problems
* TypeScript problems
* broken imports
* wallet connector issues
* wrong explorer URL
* incorrect transaction confirmation handling
* responsive layout problems

Fix anything you find.

==================================================
REAL-WORLD TEST LIMITATION

You may not have access to my physical wallet.

Therefore distinguish clearly between:

A. Code/build verification you can perform automatically.

B. A real wallet transaction test that requires me to connect my own wallet.

Do NOT claim that a real blockchain transaction was completed unless one actually was.

If the app builds successfully but a real wallet transaction cannot be performed automatically, state that clearly.

==================================================
IMPORTANT AGENT BEHAVIOR

Do not repeatedly ask me for permission to create ordinary project files.

You are responsible for implementing the project.

Do not stop after writing a plan.

Do not return a giant collection of code snippets instead of modifying the repository.

Do not ask me to manually create every file.

Do not claim success without verification.

Do not invent test results.

If something fails, investigate it.

If a dependency/API differs from expectations, inspect the installed package/version and adapt the implementation.

If a command fails because of an environment limitation, clearly distinguish that from an application/code failure and continue with everything else possible.

Keep the implementation focused on the requested product.

==================================================
FINAL DELIVERABLE

When you have completed the implementation and verification cycle, provide a concise final report containing:

1. What you built.
2. Project structure summary.
3. Exact command to start the application.
4. Exact environment variables I need to configure.
5. How to set my public recipient wallet address.
6. How to connect MetaMask or another supported wallet.
7. How to switch to Sepolia.
8. How to obtain Sepolia test ETH.
9. How to perform a complete real test transaction.
10. The Sepolia block explorer URL format.
11. What automated checks passed.
12. Any remaining limitations or unverified items.

MOST IMPORTANT:

BUILD THE APPLICATION DIRECTLY IN THE CURRENT REPOSITORY.

Do not merely tell me how to build it.

Start now.

First inspect the repository and environment, then proceed through initialization → implementation → verification → fixes → final report.