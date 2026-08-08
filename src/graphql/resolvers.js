import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Account } from "@/models/Account";
import { Transaction } from "@/models/Transaction";
import { Notification } from "@/models/Notification";
import { SupportTicket } from "@/models/SupportTicket";
import { AuditLog } from "@/models/AuditLog";

const COOKIE_NAME = "payix_token";

async function setAuthCookie(userId) {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    await connectToDatabase();
    return User.findById(payload.sub);
  } catch {
    return null;
  }
}

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  if (user.role !== "admin") throw new Error("Admin access required");
  return user;
}

async function audit(admin, action, targetUser, details) {
  await AuditLog.create({
    admin: admin.id,
    adminName: admin.name,
    action,
    targetUser,
    details,
  });
}

async function recalcAccountBalance(accountId) {
  const txs = await Transaction.find({ account: accountId });
  const balance = txs.reduce(
    (sum, tx) => sum + (tx.type === "expense" ? -tx.amount : tx.amount),
    0
  );
  await Account.findByIdAndUpdate(accountId, { balance });
  return balance;
}

export const resolvers = {
  Transaction: {
    occurredAt: (tx) => tx.occurredAt || tx.createdAt,
  },

  Query: {
    ping: () => "pong",

    me: async () => {
      return getCurrentUser();
    },

    accounts: async () => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");
      return Account.find({ user: user.id }).sort({ createdAt: -1 });
    },

    account: async (_, { id }) => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");
      return Account.findOne({ _id: id, user: user.id });
    },

    transactions: async (_, { accountId }) => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");
      const account = await Account.findOne({ _id: accountId, user: user.id });
      if (!account) throw new Error("Account not found");
      return Transaction.find({ account: accountId }).sort({ createdAt: -1 });
    },

    notifications: async () => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");
      return Notification.find({ user: user.id }).sort({ createdAt: -1 }).limit(20);
    },

    myTickets: async () => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");
      return SupportTicket.find({ user: user.id }).sort({ createdAt: -1 });
    },

    adminUsers: async (_, { search }) => {
      await requireAdmin();
      const filter = search
        ? { $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ] }
        : {};
      const users = await User.find(filter).sort({ createdAt: -1 }).limit(100);

      return Promise.all(
        users.map(async (u) => {
          const accounts = await Account.find({ user: u.id });
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            accountType: u.accountType,
            role: u.role ?? "user",
            createdAt: u.createdAt,
            accounts,
            totalBalance: accounts.reduce((s, a) => s + a.balance, 0),
          };
        })
      );
    },

    adminUser: async (_, { id }) => {
      await requireAdmin();
      const u = await User.findById(id);
      if (!u) return null;
      const accounts = await Account.find({ user: u.id });
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        accountType: u.accountType,
        role: u.role ?? "user",
        createdAt: u.createdAt,
        accounts,
        totalBalance: accounts.reduce((s, a) => s + a.balance, 0),
      };
    },

    adminUserTransactions: async (_, { userId }) => {
      await requireAdmin();
      const accounts = await Account.find({ user: userId });
      return Transaction.find({ account: { $in: accounts.map((a) => a.id) } })
        .sort({ createdAt: -1 })
        .limit(100);
    },

    adminTickets: async () => {
      await requireAdmin();
      return SupportTicket.find().sort({ createdAt: -1 }).limit(100);
    },

    auditLog: async () => {
      await requireAdmin();
      return AuditLog.find().sort({ createdAt: -1 }).limit(100);
    },
  },

  Mutation: {
    signUp: async (_, { input }) => {
      await connectToDatabase();

      const email = input.email.toLowerCase().trim();
      const existing = await User.findOne({ email });
      if (existing) throw new Error("An account with this email already exists.");

      if (input.password.length < 8) {
        throw new Error("Password must be at least 8 characters.");
      }

      const passwordHash = await bcrypt.hash(input.password, 10);
      const user = await User.create({
        name: input.name.trim(),
        email,
        passwordHash,
        accountType: input.accountType ?? "personal",
      });

      await Account.create({ user: user.id, name: "Main Account", currency: "USD", balance: 0 });

      await setAuthCookie(user.id);
      return { user };
    },

    logIn: async (_, { input }) => {
      await connectToDatabase();

      const user = await User.findOne({ email: input.email.toLowerCase().trim() });
      if (!user) throw new Error("Invalid email or password.");

      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) throw new Error("Invalid email or password.");

      await setAuthCookie(user.id);
      return { user };
    },

    logOut: async () => {
      const cookieStore = await cookies();
      cookieStore.delete(COOKIE_NAME);
      return true;
    },

    createAccount: async (_, { name }) => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");
      return Account.create({
        user: user.id,
        name: name?.trim() || "New Card",
        currency: "USD",
        balance: 0,
      });
    },

    createTransaction: async (_, { input }) => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      const account = await Account.findOne({ _id: input.accountId, user: user.id });
      if (!account) throw new Error("Account not found");

      const transaction = await Transaction.create({
        account: input.accountId,
        type: input.type,
        category: input.category ?? "General",
        amount: input.amount,
        description: input.description ?? "",
      });

      const delta = input.type === "expense" ? -input.amount : input.amount;
      await Account.findByIdAndUpdate(input.accountId, { $inc: { balance: delta } });

      return transaction;
    },

    updateProfile: async (_, { name }) => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");
      if (!name.trim()) throw new Error("Name cannot be empty.");
      user.name = name.trim();
      await user.save();
      return user;
    },

    changePassword: async (_, { currentPassword, newPassword }) => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) throw new Error("Current password is incorrect.");
      if (newPassword.length < 8) throw new Error("New password must be at least 8 characters.");
      user.passwordHash = await bcrypt.hash(newPassword, 10);
      await user.save();
      return true;
    },

    sendMoney: async (_, { input }) => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      const fromAccount = await Account.findOne({ _id: input.fromAccountId, user: user.id });
      if (!fromAccount) throw new Error("Account not found");

      if (fromAccount.frozen) {
        throw new Error("This account is frozen. Contact support to resolve this before sending money.");
      }

      if (input.amount <= 0) throw new Error("Amount must be positive.");
      if (fromAccount.balance < input.amount) throw new Error("Insufficient balance.");

      const recipient = await User.findOne({ email: input.toEmail.toLowerCase().trim() });
      if (!recipient) throw new Error("No Payix user with that email.");
      if (recipient.id === user.id) throw new Error("Use your own cards to move money between them.");

      const toAccount = await Account.findOne({ user: recipient.id }).sort({ createdAt: 1 });
      if (!toAccount) throw new Error("Recipient has no account.");

      await Transaction.create({
        account: fromAccount.id,
        type: "expense",
        category: "Transfer",
        amount: input.amount,
        description: `Sent to ${recipient.name}`,
      });
      await Account.findByIdAndUpdate(fromAccount.id, { $inc: { balance: -input.amount } });

      await Transaction.create({
        account: toAccount.id,
        type: "income",
        category: "Received",
        amount: input.amount,
        description: `Received from ${user.name}`,
      });
      await Account.findByIdAndUpdate(toAccount.id, { $inc: { balance: input.amount } });

      await Notification.create({
        user: recipient.id,
        message: `You received $${input.amount.toLocaleString()} from ${user.name}.`,
      });

      return true;
    },

    markNotificationsRead: async () => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");
      await Notification.updateMany({ user: user.id, read: false }, { read: true });
      return true;
    },

    createSupportTicket: async (_, { subject, category, message }) => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not authenticated");
      if (!subject.trim() || !message.trim()) throw new Error("Subject and message are required.");

      const reference = `PYX-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;

      const ticket = await SupportTicket.create({
        user: user.id,
        reference,
        subject: subject.trim(),
        category,
        message: message.trim(),
      });

      await Notification.create({
        user: user.id,
        message: `Support ticket ${reference} received. Our team typically responds within 24 hours.`,
      });

      return ticket;
    },

    adminSetFrozen: async (_, { accountId, frozen, reason }) => {
      const admin = await requireAdmin();
      if (!reason.trim()) throw new Error("A reason is required and will be recorded.");

      const account = await Account.findById(accountId);
      if (!account) throw new Error("Account not found");

      account.frozen = frozen;
      account.frozenReason = frozen ? reason.trim() : "";
      await account.save();

      await audit(
        admin,
        frozen ? "FREEZE_ACCOUNT" : "UNFREEZE_ACCOUNT",
        account.user,
        `${account.name} (${accountId}) — ${reason.trim()}`
      );

      await Notification.create({
        user: account.user,
        message: frozen
          ? `Your card "${account.name}" was frozen by support. Contact us via the Support page if you need help.`
          : `Your card "${account.name}" was unfrozen and is active again.`,
      });

      return account;
    },

    adminSeedBalance: async (_, { accountId, amount, note }) => {
      const admin = await requireAdmin();
      const account = await Account.findById(accountId);
      if (!account) throw new Error("Account not found");

      await Transaction.create({
        account: account.id,
        type: amount >= 0 ? "income" : "expense",
        category: "Main Balance",
        amount: Math.abs(amount),
        description: `Test data seeded by admin ${admin.name}${note ? ` — ${note}` : ""}`,
      });

      await Account.findByIdAndUpdate(account.id, { $inc: { balance: amount } });
      await audit(admin, "SEED_TEST_BALANCE", account.user, `${amount} on ${account.name}`);

      return Account.findById(account.id);
    },

    adminIssueCard: async (_, { userId, name }) => {
      const admin = await requireAdmin();
      const account = await Account.create({
        user: userId,
        name: name.trim() || "New Card",
        currency: "USD",
        balance: 0,
      });
      await audit(admin, "ISSUE_CARD", userId, account.name);
      return account;
    },

    adminSetTicketStatus: async (_, { ticketId, status }) => {
      const admin = await requireAdmin();
      if (!["open", "in_progress", "resolved"].includes(status)) {
        throw new Error("Invalid status");
      }
      const ticket = await SupportTicket.findById(ticketId);
      if (!ticket) throw new Error("Ticket not found");

      ticket.status = status;
      await ticket.save();
      await audit(admin, "TICKET_STATUS", ticket.user, `${ticket.reference} → ${status}`);

      await Notification.create({
        user: ticket.user,
        message: `Your support ticket ${ticket.reference} is now ${status.replace("_", " ")}.`,
      });

      return ticket;
    },

    adminSetBalance: async (_, { accountId, target, note }) => {
      const admin = await requireAdmin();
      const account = await Account.findById(accountId);
      if (!account) throw new Error("Account not found");

      const delta = target - account.balance;
      if (delta === 0) return account;

      await Transaction.create({
        account: account.id,
        type: delta > 0 ? "income" : "expense",
        category: "Main Balance",
        amount: Math.abs(delta),
        description: `Balance set to ${target} by admin ${admin.name}${note ? ` — ${note}` : ""}`,
      });

      await Account.findByIdAndUpdate(account.id, { $inc: { balance: delta } });
      await audit(admin, "SET_BALANCE", account.user, `${account.name}: ${account.balance} → ${target}`);

      return Account.findById(account.id);
    },

    adminCreateTransaction: async (_, { accountId, type, category, amount, description, occurredAt }) => {
      const admin = await requireAdmin();
      const account = await Account.findById(accountId);
      if (!account) throw new Error("Account not found");
      if (!["income", "expense", "transfer"].includes(type)) throw new Error("Invalid transaction type");
      if (amount <= 0) throw new Error("Amount must be positive.");

      const tx = await Transaction.create({
        account: accountId,
        type,
        category: category?.trim() || "General",
        amount,
        description: description?.trim() || "",
        occurredAt: occurredAt ? new Date(occurredAt) : new Date(),
      });

      await recalcAccountBalance(accountId);
      await audit(admin, "CREATE_TRANSACTION", account.user, `${type} $${amount} on ${account.name} — ${category || "General"}`);

      return tx;
    },

    adminEditTransaction: async (_, { transactionId, type, category, amount, description, occurredAt }) => {
      const admin = await requireAdmin();
      const tx = await Transaction.findById(transactionId);
      if (!tx) throw new Error("Transaction not found");
      if (tx.frozen) throw new Error("This transaction is frozen. Unfreeze it before editing.");

      if (type) {
        if (!["income", "expense", "transfer"].includes(type)) throw new Error("Invalid transaction type");
        tx.type = type;
      }
      if (category !== undefined) tx.category = category.trim() || "General";
      if (description !== undefined) tx.description = description.trim();
      if (amount !== undefined) {
        if (amount <= 0) throw new Error("Amount must be positive.");
        tx.amount = amount;
      }
      if (occurredAt) tx.occurredAt = new Date(occurredAt);

      await tx.save();
      await recalcAccountBalance(tx.account);

      const account = await Account.findById(tx.account);
      await audit(admin, "EDIT_TRANSACTION", account.user, `${transactionId} on ${account.name}`);

      return tx;
    },

    adminDeleteTransaction: async (_, { transactionId }) => {
      const admin = await requireAdmin();
      const tx = await Transaction.findById(transactionId);
      if (!tx) throw new Error("Transaction not found");
      if (tx.frozen) throw new Error("This transaction is frozen. Unfreeze it before deleting.");

      const account = await Account.findById(tx.account);
      await Transaction.findByIdAndDelete(transactionId);
      await recalcAccountBalance(tx.account);

      await audit(admin, "DELETE_TRANSACTION", account.user, `${tx.category} $${tx.amount} on ${account.name}`);

      return true;
    },

    adminSetTransactionFrozen: async (_, { transactionId, frozen, reason }) => {
      const admin = await requireAdmin();
      if (!reason.trim()) throw new Error("A reason is required and will be recorded.");

      const tx = await Transaction.findById(transactionId);
      if (!tx) throw new Error("Transaction not found");

      tx.frozen = frozen;
      await tx.save();

      const account = await Account.findById(tx.account);
      await audit(
        admin,
        frozen ? "FREEZE_TRANSACTION" : "UNFREEZE_TRANSACTION",
        account.user,
        `${tx.category} $${tx.amount} on ${account.name} — ${reason.trim()}`
      );

      return tx;
    },
  },
};