"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { parseEther, isAddress, formatEther } from "viem";
import { sepolia } from "viem/chains";

type TipAmount = "0.001" | "0.002" | "0.005" | "custom";

type TxState =
  | "idle"
  | "wallet-confirm"
  | "pending"
  | "confirmed"
  | "failed"
  | "rejected";

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getRecipientAddress(): `0x${string}` | null {
  const addr = process.env.NEXT_PUBLIC_TIP_RECIPIENT_ADDRESS;
  if (!addr || !isAddress(addr)) return null;
  return addr as `0x${string}`;
}

export function CryptoTip() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const recipient = getRecipientAddress();

  const { data: balance } = useBalance({
    address,
    chainId: sepolia.id,
  });

  const {
    sendTransaction,
    data: txHash,
    isPending: isSendPending,
    error: sendError,
    reset: resetSend,
  } = useSendTransaction();

  const {
    isLoading: isTxPending,
    isSuccess: isTxConfirmed,
    isError: isTxFailed,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: sepolia.id,
  });

  const [selectedAmount, setSelectedAmount] = useState<TipAmount>("0.001");
  const [customAmount, setCustomAmount] = useState("");
  const [txState, setTxState] = useState<TxState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isSepolia = chainId === sepolia.id;
  const isWrongNetwork = isConnected && !isSepolia;

  useEffect(() => {
    if (isSendPending) setTxState("wallet-confirm");
    if (isTxPending) setTxState("pending");
    if (isTxConfirmed) setTxState("confirmed");
    if (isTxFailed) setTxState("failed");
  }, [isSendPending, isTxPending, isTxConfirmed, isTxFailed]);

  useEffect(() => {
    if (sendError) {
      const msg = sendError.message.toLowerCase();
      if (msg.includes("user rejected") || msg.includes("user denied")) {
        setTxState("rejected");
        setErrorMessage("Transaction rejected by user.");
      } else if (msg.includes("insufficient funds") || msg.includes("insufficient balance")) {
        setTxState("failed");
        setErrorMessage("Insufficient balance for this transaction.");
      } else {
        setTxState("failed");
        setErrorMessage(sendError.message || "Transaction failed.");
      }
    }
  }, [sendError]);

  function getAmountEth(): string | null {
    if (selectedAmount === "custom") {
      const trimmed = customAmount.trim();
      if (!trimmed || isNaN(Number(trimmed)) || Number(trimmed) <= 0) return null;
      return trimmed;
    }
    return selectedAmount;
  }

  function hasSufficientBalance(amountEth: string): boolean {
    if (!balance) return true;
    try {
      const amountWei = parseEther(amountEth);
      return balance.value >= amountWei;
    } catch {
      return false;
    }
  }

  async function handleTip() {
    setErrorMessage("");
    resetSend();

    if (!isConnected || !address) {
      setErrorMessage("Please connect your wallet first.");
      return;
    }

    if (!isSepolia) {
      setErrorMessage("Please switch to Sepolia testnet.");
      return;
    }

    if (!recipient) {
      setErrorMessage("Invalid recipient address configured.");
      return;
    }

    const amountEth = getAmountEth();
    if (!amountEth) {
      setErrorMessage("Please select or enter a valid tip amount.");
      return;
    }

    if (!hasSufficientBalance(amountEth)) {
      setErrorMessage("Insufficient balance for this transaction.");
      return;
    }

    try {
      setTxState("wallet-confirm");
      sendTransaction({
        to: recipient,
        value: parseEther(amountEth),
        chainId: sepolia.id,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.toLowerCase().includes("user rejected")) {
        setTxState("rejected");
        setErrorMessage("Transaction rejected by user.");
      } else {
        setTxState("failed");
        setErrorMessage(msg);
      }
    }
  }

  function handleSwitchToSepolia() {
    if (switchChain) {
      switchChain({ chainId: sepolia.id });
    }
  }

  function resetTransaction() {
    setTxState("idle");
    setErrorMessage("");
    resetSend();
  }

  function getExplorerLink(hash: string): string {
    return `https://sepolia.etherscan.io/tx/${hash}`;
  }

  const tipAmounts: { value: TipAmount; label: string }[] = [
    { value: "0.001", label: "0.001 ETH" },
    { value: "0.002", label: "0.002 ETH" },
    { value: "0.005", label: "0.005 ETH" },
    { value: "custom", label: "CUSTOM" },
  ];

  const buttonBase =
    "border-4 border-black px-8 py-4 text-lg font-bold uppercase tracking-wider transition-colors duration-100 disabled:cursor-not-allowed disabled:opacity-40";
  const buttonPrimary = "bg-black text-white hover:bg-white hover:text-black";
  const buttonSecondary = "bg-white text-black hover:bg-black hover:text-white";

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 md:py-20">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            CRYPTO TIP
          </h1>
          <div className="w-full h-1 bg-black mb-6" />
          <p className="text-base md:text-lg leading-relaxed max-w-lg">
            Tanmay here—exploring web3 one block at a time. 
            Send a testnet coffee and try out the smart contract flow.
          </p>
        </header>

        {/* Hero */}
        <section className="mb-12">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-2">
            BUY ME A COFFEE.
          </h2>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            ON-CHAIN.
          </h2>
        </section>

        {/* Wallet Connection */}
        <section className="mb-8 border-4 border-black p-6">
          <h3 className="text-xl font-bold uppercase mb-4">Wallet</h3>
          {!isConnected ? (
            <div>
              <p className="mb-4 text-sm">
                Connect your wallet to send a tip on Sepolia testnet.
              </p>
              <div className="flex flex-wrap gap-3">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    disabled={isConnecting}
                    className={`${buttonBase} ${buttonPrimary}`}
                  >
                    {isConnecting ? "CONNECTING..." : `CONNECT ${connector.name.toUpperCase()}`}
                  </button>
                ))}
              </div>
              {connectors.length === 0 && (
                <p className="text-sm text-gray-600">
                  No wallet detected. Please install MetaMask or another injected wallet.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-6 items-center">
                <div>
                  <span className="text-xs uppercase block mb-1">Connected</span>
                  <span className="font-mono text-sm border-2 border-black px-3 py-1">
                    {address ? shortenAddress(address) : ""}
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase block mb-1">Balance</span>
                  <span className="font-mono text-sm border-2 border-black px-3 py-1">
                    {balance ? `${formatEther(balance.value)} ETH` : "---"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => disconnect()}
                className={`${buttonBase} ${buttonSecondary} !px-6 !py-2 !text-sm`}
              >
                DISCONNECT
              </button>
            </div>
          )}
        </section>

        {/* Network Status */}
        <section className="mb-8 border-4 border-black p-6">
          <h3 className="text-xl font-bold uppercase mb-4">Network</h3>
          {!isConnected ? (
            <p className="text-sm text-gray-600">Connect wallet to see network status.</p>
          ) : isSepolia ? (
            <div className="flex items-center gap-3">
              <span className="inline-block w-3 h-3 bg-black" />
              <span className="font-bold">SEPOLIA TESTNET</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="inline-block w-3 h-3 bg-red-600" />
                <span className="font-bold">WRONG NETWORK</span>
              </div>
              <p className="text-sm">
                This app only works on Sepolia testnet. Please switch networks.
              </p>
              <button
                onClick={handleSwitchToSepolia}
                className={`${buttonBase} ${buttonPrimary} !px-6 !py-2 !text-sm`}
              >
                SWITCH TO SEPOLIA
              </button>
            </div>
          )}
        </section>

        {/* Tip Amount Selector */}
        <section className="mb-8 border-4 border-black p-6">
          <h3 className="text-xl font-bold uppercase mb-4">Tip Amount</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {tipAmounts.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedAmount(opt.value)}
                disabled={isTxPending || txState === "wallet-confirm"}
                className={`${buttonBase} !px-4 !py-3 !text-sm ${
                  selectedAmount === opt.value
                    ? "bg-black text-white"
                    : buttonSecondary
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {selectedAmount === "custom" && (
            <div className="mt-4">
              <label className="text-xs uppercase block mb-2">
                Custom Amount (ETH)
              </label>
              <input
                type="text"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="0.01"
                disabled={isTxPending || txState === "wallet-confirm"}
                className="w-full border-4 border-black px-4 py-3 text-lg font-mono focus:outline-none disabled:opacity-40"
              />
            </div>
          )}
        </section>

        {/* Main CTA */}
        <section className="mb-8">
          <button
            onClick={handleTip}
            disabled={
              !isConnected ||
              isWrongNetwork ||
              isTxPending ||
              txState === "wallet-confirm" ||
              txState === "confirmed"
            }
            className={`${buttonBase} w-full ${buttonPrimary} text-2xl md:text-3xl`}
          >
            {txState === "wallet-confirm"
              ? "CONFIRM IN WALLET..."
              : txState === "pending"
              ? "PROCESSING..."
              : txState === "confirmed"
              ? "COFFEE SENT"
              : "BUY ME A COFFEE"}
          </button>
        </section>

        {/* Transaction Status */}
        {txState !== "idle" && txState !== "confirmed" && (
          <section className="mb-8 border-4 border-black p-6">
            <h3 className="text-xl font-bold uppercase mb-4">Transaction</h3>
            <div className="space-y-3">
              {txState === "wallet-confirm" && (
                <div className="flex items-center gap-3">
                  <span className="inline-block w-3 h-3 bg-yellow-500 animate-pulse" />
                  <span>Waiting for wallet confirmation...</span>
                </div>
              )}
              {txState === "pending" && (
                <div className="flex items-center gap-3">
                  <span className="inline-block w-3 h-3 bg-blue-500 animate-pulse" />
                  <span>Transaction pending...</span>
                </div>
              )}
              {txState === "rejected" && (
                <div className="flex items-center gap-3">
                  <span className="inline-block w-3 h-3 bg-red-600" />
                  <span className="font-bold">TRANSACTION REJECTED</span>
                </div>
              )}
              {txState === "failed" && (
                <div className="flex items-center gap-3">
                  <span className="inline-block w-3 h-3 bg-red-600" />
                  <span className="font-bold">TRANSACTION FAILED</span>
                </div>
              )}
              {txHash && (
                <a
                  href={getExplorerLink(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline hover:no-underline break-all"
                >
                  VIEW TRANSACTION
                </a>
              )}
            </div>
          </section>
        )}

        {/* Confirmed State */}
        {txState === "confirmed" && txHash && (
          <section className="mb-8 border-4 border-black p-6">
            <h3 className="text-xl font-bold uppercase mb-4">Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="inline-block w-3 h-3 bg-green-600" />
                <span className="font-bold text-xl">COFFEE SENT</span>
              </div>
              <p className="text-sm">Your tip has been confirmed on Sepolia.</p>
              <a
                href={getExplorerLink(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-4 border-black px-6 py-3 text-sm font-bold uppercase hover:bg-black hover:text-white transition-colors"
              >
                VIEW TRANSACTION
              </a>
              <button
                onClick={resetTransaction}
                className="block text-xs underline mt-4 hover:no-underline"
              >
                SEND ANOTHER
              </button>
            </div>
          </section>
        )}

        {/* Error Display */}
        {errorMessage && txState !== "idle" && (
          <div className="mb-8 border-4 border-red-600 p-4">
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 border-t-4 border-black pt-6">
          <div className="text-xs space-y-1">
            <p className="font-bold uppercase">
              Built with Next.js / Wagmi / Viem
            </p>
            <p className="font-bold uppercase">Sepolia Testnet</p>
            <p>Transactions are executed directly from your connected wallet.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
